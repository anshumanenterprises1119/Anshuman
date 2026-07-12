'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useRouter } from 'next/navigation';

export default function CheckoutPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { cart, clearCart } = useCart();
  const { user, signInWithEmail, verifyOtp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [couponCode, setCouponCode] = useState('');
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
  }, [brandSlug]);

  const brandCartItems = cart.filter((item) => item.brandSlug === brandSlug);
  const subtotal = brandCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const res = await signInWithEmail(email);
    setAuthLoading(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setAuthError(res.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const res = await verifyOtp(email, otp);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid OTP');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCheckoutError('Please log in using Email OTP first.');
      return;
    }
    
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandSlug,
          items: brandCartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
          },
          paymentMethod,
          couponCode,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      clearCart();

      // If online PG, redirect to payment URL, otherwise show success dashboard
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/${brandSlug}/dashboard?orderId=${data.orderId}`);
      }
    } catch (err: any) {
      setCheckoutError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold tracking-tight">Checkout</h2>

      {!user ? (
        /* OTP Auth Step */
        <div className="glass-card max-w-md mx-auto space-y-6">
          <h3 className="text-xl font-bold">Sign In using Email OTP</h3>
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" fullWidth disabled={authLoading}>
                {authLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="Enter 6-Digit OTP"
                type="text"
                placeholder="XXXXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button type="submit" fullWidth disabled={authLoading}>
                {authLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}
        </div>
      ) : (
        /* Checkout Form Step */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Billing / Shipping Info Form */}
          <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
            <div className="glass-card space-y-4">
              <h3 className="text-lg font-bold">Shipping Address</h3>
              <Input
                label="Full Name"
                placeholder="Receiver name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Address Line 1"
                placeholder="Street address, company name"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
              <Input
                label="Address Line 2 (Optional)"
                placeholder="Apartment, suite, unit etc."
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="State"
                  placeholder="State / Region"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Pincode / Postal Code"
                placeholder="Pincode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div className="glass-card space-y-4">
              <h3 className="text-lg font-bold">Payment Option</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 justify-center font-semibold">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  COD (Cash on Delivery)
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 justify-center font-semibold">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  Pay via UPI / Card
                </label>
              </div>
            </div>

            {checkoutError && <p className="text-sm text-red-500 font-semibold">{checkoutError}</p>}
            
            <Button type="submit" fullWidth size="lg" disabled={checkoutLoading}>
              {checkoutLoading ? 'Processing...' : 'Place Order'}
            </Button>
          </form>

          {/* Checkout Totals & Coupons Summary */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="form-input py-2"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="secondary" className="py-2">Apply</Button>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold">Items Review</h3>
              <div className="divide-y text-sm">
                {brandCartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-[var(--text-primary)]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                  <span>Shipping Fee</span>
                  <span>₹{brandSlug === 'futurewithai' ? 0 : 60}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-2 border-t">
                  <span>Grand Total</span>
                  <span>₹{subtotal + (brandSlug === 'futurewithai' ? 0 : 60)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
