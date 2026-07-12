import { supabaseAdmin } from '../supabase/admin';

export type LogType =
  | 'error'
  | 'health_check'
  | 'backup'
  | 'task_queue'
  | 'request'
  | 'performance'
  | 'business'
  | 'search'
  | 'customer'
  | 'admin';

export type LogSeverity = 'info' | 'warning' | 'error' | 'critical';

export class ObservabilityLogger {
  /**
   * Core logging mechanism that writes directly to the operation_logs table.
   */
  private static async logToDb(
    type: LogType,
    severity: LogSeverity,
    message: string,
    details?: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin.from('operation_logs').insert({
        type,
        severity,
        message,
        details: details || null
      });

      if (error) {
        console.error(`[DB Logging Error] Failed to write log: ${error.message}`);
        return false;
      }
      return true;
    } catch (e: any) {
      console.error(`[DB Logging Exception] Failed to insert log: ${e.message}`);
      return false;
    }
  }

  /**
   * Logs incoming HTTP requests and latencies.
   */
  static async logRequest(
    method: string,
    url: string,
    status: number,
    latencyMs: number,
    ip = 'unknown',
    userAgent = 'unknown'
  ): Promise<boolean> {
    const severity: LogSeverity = status >= 500 ? 'error' : status >= 400 ? 'warning' : 'info';
    const message = `${method} ${url} completed with status ${status} in ${latencyMs}ms`;
    
    return this.logToDb('request', severity, message, {
      method,
      url,
      status,
      latency_ms: latencyMs,
      ip_address: ip,
      user_agent: userAgent
    });
  }

  /**
   * Logs general application runtime errors.
   */
  static async logError(
    message: string,
    errorStack?: string,
    severity: LogSeverity = 'error',
    details?: Record<string, any>
  ): Promise<boolean> {
    return this.logToDb('error', severity, message, {
      stack: errorStack || null,
      ...details
    });
  }

  /**
   * Logs application performance metrics.
   */
  static async logPerformance(
    metricName: string,
    valueMs: number,
    details?: Record<string, any>
  ): Promise<boolean> {
    const severity: LogSeverity = valueMs > 500 ? 'warning' : 'info';
    const message = `Performance Metric [${metricName}]: ${valueMs}ms`;

    return this.logToDb('performance', severity, message, {
      metric_name: metricName,
      latency_ms: valueMs,
      ...details
    });
  }

  /**
   * Logs commercial business events (checkout completions, signups, coupon usage).
   */
  static async logBusinessEvent(
    eventName: string,
    message: string,
    details: Record<string, any>
  ): Promise<boolean> {
    return this.logToDb('business', 'info', message, {
      event_name: eventName,
      ...details
    });
  }

  /**
   * Logs user search query metrics.
   */
  static async logSearch(query: string, resultsCount: number, userId?: string): Promise<boolean> {
    const message = `Search query "${query}" matched ${resultsCount} results`;
    return this.logToDb('search', 'info', message, {
      search_query: query,
      results_count: resultsCount,
      user_id: userId || null
    });
  }

  /**
   * Logs general customer dashboard events (profile settings updates, password resets).
   */
  static async logCustomerEvent(userId: string, action: string, details?: Record<string, any>): Promise<boolean> {
    const message = `Customer ${userId} performed action: ${action}`;
    return this.logToDb('customer', 'info', message, {
      customer_id: userId,
      action,
      ...details
    });
  }

  /**
   * Logs administrative panel configuration changes (CMS edits, product additions).
   */
  static async logAdminAction(
    adminId: string,
    action: string,
    targetTable?: string,
    targetId?: string,
    details?: Record<string, any>
  ): Promise<boolean> {
    const message = `Admin ${adminId} performed action: ${action}`;
    return this.logToDb('admin', 'warning', message, {
      admin_id: adminId,
      action,
      target_table: targetTable || null,
      target_id: targetId || null,
      ...details
    });
  }
}
