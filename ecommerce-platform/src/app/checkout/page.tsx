'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
}

export default function CheckoutPage() {
  const { user, profile } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState('');
  
  // New address states
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      if (!user) return;
      const { data } = await supabase
        .from('addresses')
        .select('id, type, address_line1, address_line2, city, state, postal_code')
        .eq('profile_id', user.id);
      
      if (data) {
        setAddresses(data as Address[]);
        if (data.length > 0) {
          setSelectedAddrId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading checkout addresses:', e);
    }
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          profile_id: user.id,
          type: 'shipping',
          address_line1: addressLine1,
          address_line2: addressLine2 || null,
          city,
          state,
          postal_code: postalCode,
          is_default: addresses.length === 0,
        })
        .select('id')
        .single();

      if (error) throw error;

      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      
      loadAddresses();
      if (data) {
        setSelectedAddrId(data.id);
      }
    } catch (err) {
      console.error('Error inserting checkout address:', err);
    }
  };

  // Pricing calculations
  const userLevel = profile?.level || 'bronze';
  const discountRates = { gold: 0.10, silver: 0.05, bronze: 0.00 };
  const discountRate = discountRates[userLevel as 'gold' | 'silver' | 'bronze'] || 0;
  const subtotal = getCartTotal();
  const discount = subtotal * discountRate;
  const shippingFee = subtotal > 1500 ? 0 : 150;
  const total = subtotal - discount + shippingFee;

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;
    setProcessing(true);

    try {
      // Fetch dynamic brand id matching storefront slug
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', 'anshuman-enterprises')
        .single();
      
      if (!brand) throw new Error('Default brand config missing');

      const selectedAddress = addresses.find((a) => a.id === selectedAddrId);
      const addressJson = selectedAddress ? {
        address_line1: selectedAddress.address_line1,
        address_line2: selectedAddress.address_line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postal_code: selectedAddress.postal_code,
      } : {};

      const orderNumber = `ORD-${Date.now()}`;

      // 1. Create Order row
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          brand_id: brand.id,
          profile_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          shipping_address: addressJson,
          billing_address: addressJson,
          subtotal,
          discount_amount: discount,
          shipping_fee: shippingFee,
          total_amount: total,
          payment_method: paymentMethod,
          payment_status: 'paid', // Mock successful charge
        })
        .select('id')
        .single();

      if (orderError || !order) throw orderError;

      // 2. Create Order Items rows
      for (const item of cart) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        });
      }

      // 3. Log Payment Transaction
      const transactionId = `TXN-${Date.now()}`;
      await supabase.from('payments').insert({
        order_id: order.id,
        payment_method: paymentMethod,
        provider: 'MockGateway',
        transaction_id: transactionId,
        amount: total,
        status: 'completed',
      });

      // 4. Log Checkout Session
      await supabase.from('checkout_sessions').insert({
        profile_id: user.id,
        cart_items: cart,
        shipping_address_id: selectedAddrId,
        status: 'completed',
      });

      // 5. Trigger Notification Hook
      await supabase.from('notifications').insert({
        profile_id: user.id,
        title: 'Order Successfully Placed',
        message: `Your purchase request (Order #${orderNumber}) has been logged. Total charged: ₹${total.toLocaleString()}.`,
        type: 'order_update',
      });

      // 6. Clear shopping cart
      await clearCart();
      
      setStep(4);
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Error compiling checkout pipeline.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in text-gray-800">
      
      {/* Checkout wizard headers */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Checkout Portal</h1>
        <div className="flex gap-4 text-xs font-bold text-gray-400 mt-4 select-none">
          <span className={step >= 1 ? 'text-indigo-600' : ''}>1. Shipping</span>
          <span>&rarr;</span>
          <span className={step >= 2 ? 'text-indigo-600' : ''}>2. Summary</span>
          <span>&rarr;</span>
          <span className={step >= 3 ? 'text-indigo-600' : ''}>3. Payment</span>
          <span>&rarr;</span>
          <span className={step === 4 ? 'text-indigo-600' : ''}>4. Complete</span>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center text-xs font-bold text-white">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Processing Mock Transaction...</p>
          </div>
        </div>
      )}

      {/* STEP 1: Address book select */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-700">Choose Shipping Address</h2>
              {addresses.length === 0 ? (
                <p className="text-xs text-gray-400">No addresses saved in address book.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-xs">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`border rounded-xl p-4 flex gap-3 cursor-pointer select-none transition ${
                        selectedAddrId === a.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-150 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping_addr"
                        checked={selectedAddrId === a.id}
                        onChange={() => setSelectedAddrId(a.id)}
                        className="accent-indigo-600 mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-gray-800 leading-snug">
                          {a.address_line1}, {a.address_line2 && `${a.address_line2}, `}{a.city}, {a.state} - {a.postal_code}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Inline Add Address Form */}
            <form onSubmit={handleAddNewAddress} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-700">Or Add Address</h2>
              <Input label="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required className="bg-white border-gray-200 text-xs" />
              <Input label="Address Line 2 (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="bg-white border-gray-200 text-xs" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required className="bg-white border-gray-200 text-xs" />
                <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required className="bg-white border-gray-200 text-xs" />
              </div>
              <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="bg-white border-gray-200 text-xs" />
              <Button type="submit" variant="outline" className="text-xs py-2 rounded-lg">Save New Address</Button>
            </form>
          </div>

          <aside className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gray-800">Order Brief</h3>
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-mono font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedAddrId}
              fullWidth
              className="text-xs py-2.5 rounded-lg text-white font-bold"
            >
              Continue
            </Button>
          </aside>
        </div>
      )}

      {/* STEP 2: Review Order Details */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-700">Review Items Bag</h2>
              <div className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-mono text-gray-800">₹{Number(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-4">
            <h3 className="font-bold text-sm text-gray-800">Payment Calculations</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span className="font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee:</span>
                <span className="font-mono">₹{shippingFee.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-gray-800 text-sm">
                <span>Estimated Total:</span>
                <span className="font-mono text-indigo-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 text-xs py-2.5 rounded-lg">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1 text-xs py-2.5 rounded-lg text-white font-bold">Pay Options</Button>
            </div>
          </aside>
        </div>
      )}

      {/* STEP 3: Payments selection */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-700">Select Payment Gateway</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition select-none ${
                  paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-150 bg-white hover:bg-gray-50'
                }`}>
                  <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-indigo-600" />
                  <span className="text-lg">💳</span>
                  <span className="font-bold">Credit/Debit Card</span>
                </label>

                <label className={`border rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition select-none ${
                  paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-150 bg-white hover:bg-gray-50'
                }`}>
                  <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-indigo-600" />
                  <span className="text-lg">📱</span>
                  <span className="font-bold">Instant UPI</span>
                </label>
              </div>
            </div>
          </div>

          <aside className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-4">
            <h3 className="font-bold text-sm text-gray-800">Place Order</h3>
            <div className="flex justify-between font-bold text-gray-850">
              <span>Grand Total:</span>
              <span className="font-mono text-indigo-600">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1 text-xs py-2.5 rounded-lg">Back</Button>
              <Button onClick={handlePlaceOrder} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-xs py-2.5 rounded-lg text-white font-bold">Fulfill Payment</Button>
            </div>
          </aside>
        </div>
      )}

      {/* STEP 4: Checkout Confirmation */}
      {step === 4 && (
        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center space-y-4 max-w-md mx-auto text-xs text-gray-600">
          <span className="text-4xl">🎉</span>
          <h2 className="text-lg font-black text-gray-800">Fulfillment Successful</h2>
          <p className="leading-relaxed">
            Your transaction payment has been securely confirmed. An invoice reference has been drafted under your orders.
          </p>
          <div className="flex gap-2.5 pt-4">
            <Button onClick={() => router.push('/profile/orders')} className="flex-1 text-xs py-2 rounded-lg text-white font-bold">View Orders</Button>
            <Button onClick={() => router.push('/store')} variant="secondary" className="flex-1 text-xs py-2 rounded-lg">Continue Store</Button>
          </div>
        </div>
      )}
    </div>
  );
}
