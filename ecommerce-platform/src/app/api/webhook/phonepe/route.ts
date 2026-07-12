import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME || 'Anshumanenterprises1';
    const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD || 'Webhookanshuman1119';

    console.log('[PhonePe Webhook] Callback received');

    // 1. Verify Basic Auth signature
    if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
      console.warn('[PhonePe Webhook] Unauthorized request, header format incorrect');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const base64Credentials = authHeader.replace(/^basic\s+/i, '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
      const [username, password] = credentials.split(':');

      if (username !== webhookUsername || password !== webhookPassword) {
        console.warn('[PhonePe Webhook] Invalid credentials matched');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (e) {
      console.error('[PhonePe Webhook] Credentials decoding error:', e);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse callback body
    const callbackBody = await request.json();
    console.log('[PhonePe Webhook] Body:', JSON.stringify(callbackBody, null, 2));

    const merchantOrderId = callbackBody.merchantOrderId || callbackBody.data?.merchantOrderId;
    const orderState = callbackBody.state || callbackBody.data?.state;

    if (!merchantOrderId) {
      console.warn('[PhonePe Webhook] No merchantOrderId in payload');
      return NextResponse.json({ status: 'OK' }); // Always respond 200 to PhonePe to avoid retries
    }

    // 3. Handle status updates
    if (orderState === 'COMPLETED') {
      // Retrieve the matching order from our database
      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('id, payment_status, status, total_amount, profile_id')
        .eq('order_number', merchantOrderId)
        .single();

      if (orderErr || !order) {
        console.error(`[PhonePe Webhook] Order not found for order_number: ${merchantOrderId}`);
        return NextResponse.json({ status: 'OK' });
      }

      // Avoid reprocessing already paid orders
      if (order.payment_status !== 'paid') {
        // Update order status to paid and processing
        const { error: updateErr } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('id', order.id);

        if (updateErr) {
          console.error(`[PhonePe Webhook] Failed to update order status:`, updateErr);
          return NextResponse.json({ status: 'OK' });
        }

        // Log order confirmation in order tracking timeline
        await supabaseAdmin.from('order_tracking').insert({
          order_id: order.id,
          status: 'Paid',
          description: 'Payment successfully processed via PhonePe UPI.',
        });

        // 4. Generate digital access tokens for digital products
        const { data: items } = await supabaseAdmin
          .from('order_items')
          .select(`
            id,
            product_id,
            products (
              type
            )
          `)
          .eq('order_id', order.id);

        if (items) {
          for (const item of items) {
            // Check if item contains a digital product link
            const isDigital = (item.products as any)?.type === 'digital';
            
            if (isDigital) {
              const downloadToken = `FWA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + 30); // 30 Days expiry
              
              await supabaseAdmin.from('digital_access_tokens').insert({
                order_item_id: item.id,
                profile_id: order.profile_id,
                token: downloadToken,
                expires_at: expiryDate.toISOString(),
                max_downloads: 10,
              });

              console.log(`[PhonePe Webhook] Generated secure digital access token for item: ${item.id}`);
            }
          }
        }
      }
    } else if (orderState === 'FAILED') {
      console.log(`[PhonePe Webhook] Payment failed for ${merchantOrderId}`);
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'failed', status: 'cancelled' })
        .eq('order_number', merchantOrderId);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (err: any) {
    console.error('[PhonePe Webhook] Webhook error:', err);
    return NextResponse.json({ status: 'OK' }); // Always return 200 to prevent webhook request looping
  }
}
