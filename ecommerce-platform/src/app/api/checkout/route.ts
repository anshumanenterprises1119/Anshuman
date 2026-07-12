import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { brandSlug, items, shippingAddress, paymentMethod, couponCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    // 1. Fetch brand details
    const { data: brand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .single();

    if (brandErr || !brand) {
      return NextResponse.json({ error: 'Invalid brand session' }, { status: 400 });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 2. Validate prices and inventory in database
    for (const item of items) {
      const { data: product, error: prodErr } = await supabaseAdmin
        .from('products')
        .select('id, name, base_price, sale_price, type')
        .eq('id', item.productId)
        .eq('brand_id', brand.id)
        .single();

      if (prodErr || !product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      const itemPrice = product.sale_price || product.base_price;
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: itemPrice,
        total: itemPrice * item.quantity,
        type: product.type,
      });

      // 3. For physical products, check stock
      if (product.type === 'physical') {
        const { data: inv } = await supabaseAdmin
          .from('inventory')
          .select('quantity, reserved')
          .eq('product_id', product.id)
          .single();

        if (!inv || inv.quantity - inv.reserved < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for: ${product.name}` }, { status: 400 });
        }
      }
    }

    // 4. Calculate coupon discounts
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('id, type, value, min_purchase_amount')
        .eq('brand_id', brand.id)
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon && subtotal >= coupon.min_purchase_amount) {
        couponId = coupon.id;
        if (coupon.type === 'percentage') {
          discountAmount = (subtotal * coupon.value) / 100;
        } else {
          discountAmount = coupon.value;
        }
      }
    }

    const shippingFee = brandSlug === 'futurewithai' ? 0 : 60;
    const totalAmount = Math.max(0, subtotal - discountAmount) + shippingFee;

    // 5. Generate random order ID numbers
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Get authorized profile from request user context
    // For local mockup validation, we extract authorization user ID from header context
    const authHeader = request.headers.get('Authorization');
    let profileId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwtToken = authHeader.substring(7);
      const { data: { user } } = await supabaseAdmin.auth.getUser(jwtToken);
      if (user) profileId = user.id;
    }

    // 6. Insert Order record
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        brand_id: brand.id,
        profile_id: profileId,
        order_number: orderNumber,
        status: paymentMethod === 'cod' ? 'processing' : 'pending',
        shipping_address: shippingAddress,
        subtotal,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        coupon_id: couponId,
      })
      .select('id')
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    // 7. Insert Order Items & Update Inventory Reserves
    for (const item of validatedItems) {
      await supabaseAdmin.from('order_items').insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });

      if (item.type === 'physical') {
        // Increment reserved quantity in inventory
        const { data: inv } = await supabaseAdmin
          .from('inventory')
          .select('reserved')
          .eq('product_id', item.product_id)
          .single();

        if (inv) {
          await supabaseAdmin
            .from('inventory')
            .update({ reserved: inv.reserved + item.quantity })
            .eq('product_id', item.product_id);
        }
      } else {
        // If digital product purchased via COD, create access token immediately
        if (paymentMethod === 'cod') {
          const downloadToken = `FWA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 Days expiry
          
          await supabaseAdmin.from('digital_access_tokens').insert({
            order_item_id: order.id,
            profile_id: profileId,
            token: downloadToken,
            expires_at: expiryDate.toISOString(),
            max_downloads: 10,
          });
        }
      }
    }

    // 8. payment flows redirect links selection
    if (paymentMethod === 'upi') {
      // Return a mockup PhonePe URL callback link for simulation
      const mockPaymentUrl = `https://api.phonepe.com/apis/pg/pay?merchantId=MOCK&transactionId=${orderNumber}`;
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentUrl: mockPaymentUrl,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: null,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
