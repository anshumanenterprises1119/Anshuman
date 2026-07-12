import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook secret token (if defined in env)
    const authHeader = request.headers.get('x-shiprocket-secret');
    const systemSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    
    if (systemSecret && authHeader !== systemSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook signature' }, { status: 401 });
    }

    const payload = await request.json();

    // Map Shiprocket webhook payload parameters
    // Shiprocket sends detailed logs inside the webhook structure:
    // https://www.shiprocket.in/help/docs/webhooks/
    const {
      order_id: orderNumber, // Maps to our ORD-XXXX order_number
      current_status: currentStatus,
      etd,
      scans,
    } = payload;

    if (!orderNumber || !currentStatus) {
      return NextResponse.json({ error: 'Missing mandatory payload variables' }, { status: 400 });
    }

    // 2. Query matching order in database
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('order_number', orderNumber)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: `Order matching number ${orderNumber} not found` }, { status: 404 });
    }

    // 3. Map Shiprocket tracking statuses to database order statuses
    // Shiprocket statuses: 'AWB Assigned', 'Pickup Scheduled', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'
    let targetOrderStatus = order.status;
    const lowerStatus = currentStatus.toLowerCase();

    if (lowerStatus.includes('delivered')) {
      targetOrderStatus = 'delivered';
    } else if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) {
      targetOrderStatus = 'shipped';
    } else if (lowerStatus.includes('pickup') || lowerStatus.includes('manifest')) {
      targetOrderStatus = 'processing';
    } else if (lowerStatus.includes('cancel')) {
      targetOrderStatus = 'cancelled';
    }

    // Update order status if it changed
    if (targetOrderStatus !== order.status) {
      const paymentStatus = targetOrderStatus === 'delivered' ? 'paid' : undefined;
      const updatePayload: any = { status: targetOrderStatus };
      if (paymentStatus) updatePayload.payment_status = paymentStatus;

      await supabaseAdmin
        .from('orders')
        .update(updatePayload)
        .eq('id', order.id);
    }

    // 4. Log the scan activities in the order_tracking table
    // If scans list is provided, process the latest scan
    if (scans && Array.isArray(scans) && scans.length > 0) {
      // Sort scans by date descending to get the most recent ones
      const latestScan = scans[0];
      const { activity, location, date } = latestScan;

      // Check if this scan activity timestamp has already been logged to prevent duplicate updates
      const scanTime = date ? new Date(date).toISOString() : new Date().toISOString();
      
      const { data: existing } = await supabaseAdmin
        .from('order_tracking')
        .select('id')
        .eq('order_id', order.id)
        .eq('timestamp', scanTime)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabaseAdmin.from('order_tracking').insert({
          order_id: order.id,
          status: currentStatus,
          description: activity || `Shipment update: ${currentStatus}`,
          location: location || null,
          timestamp: scanTime,
        });
      }
    } else {
      // If no detailed scan list, insert a single standard tracking update
      await supabaseAdmin.from('order_tracking').insert({
        order_id: order.id,
        status: currentStatus,
        description: `Shipment status updated to: ${currentStatus}`,
        location: payload.location || null,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (err: any) {
    console.error('Shiprocket Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
