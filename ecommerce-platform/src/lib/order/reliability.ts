import { supabaseAdmin } from '../supabase/admin';

export interface OrderEvent {
  orderId: string;
  eventType: 'LOCK' | 'CHECKOUT_INIT' | 'PAYMENT_CLEARED' | 'STATUS_CHANGE' | 'WEBHOOK_RECEIVED' | 'REFUND';
  payload: Record<string, any>;
  userId?: string;
}

export class OrderReliabilityEngine {
  /**
   * Verifies that the checkout idempotency key is unique to prevent duplicate charges.
   */
  static async validateIdempotencyKey(key: string): Promise<{ unique: boolean; existingEvent?: any }> {
    if (!key) return { unique: true };

    const { data, error } = await supabaseAdmin
      .from('order_events')
      .select('id, order_id, payload, created_at')
      .eq('event_type', 'CHECKOUT_INIT');

    if (error) {
      console.error('Failed to validate idempotency key:', error.message);
      return { unique: true };
    }

    const duplicate = (data || []).find(event => event.payload?.idempotency_key === key);
    if (duplicate) {
      return { unique: false, existingEvent: duplicate };
    }

    return { unique: true };
  }

  /**
   * Logs a lifecycle event for an order.
   */
  static async logOrderEvent(event: OrderEvent): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('order_events')
      .insert({
        order_id: event.orderId,
        event_type: event.eventType,
        payload: event.payload,
        created_by: event.userId || null
      });

    if (error) {
      console.error(`Failed to log order event [${event.eventType}]:`, error.message);
      return false;
    }
    return true;
  }

  /**
   * Applies a row-level lock on the order using the Postgres RPC.
   */
  static async lockOrderRow(orderId: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin.rpc('lock_order_row', {
        target_order_id: orderId
      });

      if (error) {
        console.error(`Postgres lock_order_row RPC error for order ${orderId}:`, error.message);
        return false;
      }
      return !!data;
    } catch (err: any) {
      console.error(`Exception locking order row for order ${orderId}:`, err.message);
      return false;
    }
  }

  /**
   * Enqueues a task for background retries (e.g. SMTP or webhook dispatches).
   */
  static async enqueueJob(jobType: string, payload: Record<string, any>, maxAttempts = 5): Promise<string | null> {
    const { data, error } = await supabaseAdmin
      .from('job_queue')
      .insert({
        job_type: jobType,
        payload: payload,
        status: 'pending',
        attempts: 0,
        max_attempts: maxAttempts,
        next_run_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to enqueue background job [${jobType}]:`, error.message);
      return null;
    }

    return data.id;
  }

  /**
   * Executes pending background retry jobs, performing exponential backoff and DLQ routing.
   */
  static async processJobQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    const results = { processed: 0, succeeded: 0, failed: 0 };
    const now = new Date().toISOString();

    // 1. Fetch pending or previously failed jobs whose next scheduled run is ready
    const { data: jobs, error } = await supabaseAdmin
      .from('job_queue')
      .select('*')
      .in('status', ['pending', 'failed'])
      .lte('next_run_at', now);

    if (error || !jobs || jobs.length === 0) {
      if (error) console.error('Error querying job queue:', error.message);
      return results;
    }

    for (const job of jobs) {
      results.processed++;
      
      // Update status to processing
      await supabaseAdmin
        .from('job_queue')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', job.id);

      try {
        // Simulate job worker tasks (e.g. SMTP emails, Fast2SMS dispatches, Shiprocket pings)
        const jobSuccess = await this.simulateJobExecution(job.job_type, job.payload);

        if (jobSuccess) {
          await supabaseAdmin
            .from('job_queue')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', job.id);
          results.succeeded++;
        } else {
          throw new Error('Simulated external service timeout / gateway offline.');
        }
      } catch (err: any) {
        results.failed++;
        const nextAttempts = (job.attempts || 0) + 1;
        const isDLQ = nextAttempts >= (job.max_attempts || 5);
        const finalStatus = isDLQ ? 'dlq' : 'failed';
        
        // Exponential backoff delay (2^attempts * 10 seconds)
        const backoffSeconds = Math.pow(2, nextAttempts) * 10;
        const nextRunTime = new Date(Date.now() + backoffSeconds * 1000).toISOString();

        await supabaseAdmin
          .from('job_queue')
          .update({
            status: finalStatus,
            attempts: nextAttempts,
            next_run_at: isDLQ ? job.next_run_at : nextRunTime,
            last_error: err.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        // If moved to DLQ, log a critical alert in operation_logs
        if (isDLQ) {
          await supabaseAdmin.from('operation_logs').insert({
            type: 'error',
            severity: 'critical',
            message: `Background Job ${job.id} failed after ${job.max_attempts} attempts. Routed to Dead Letter Queue (DLQ).`,
            details: { job_id: job.id, job_type: job.job_type, last_error: err.message, payload: job.payload }
          });
        }
      }
    }

    return results;
  }

  /**
   * Internal mock runner for executing various background jobs.
   */
  private static async simulateJobExecution(jobType: string, payload: Record<string, any>): Promise<boolean> {
    // 90% success rate to demonstrate retries and backoff
    const rand = Math.random();
    if (rand < 0.1) {
      return false; // Simulated failure
    }
    return true; // Simulated success
  }
}
