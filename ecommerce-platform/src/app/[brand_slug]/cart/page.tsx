'use client';

import React, { useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';

export default function CartPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
  }, [brandSlug]);

  const brandCartItems = cart.filter((item) => item.brandSlug === brandSlug);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold tracking-tight">Your Cart</h2>

      {brandCartItems.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-6">
          <p className="text-[var(--text-secondary)] text-lg">Your cart is currently empty.</p>
          <Link href={`/${brandSlug}/catalog`} className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="md:col-span-2 space-y-4">
            {brandCartItems.map((item) => (
              <div key={item.id} className="glass-card p-6 flex flex-row items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {item.type}
                  </span>
                  <h4 className="font-bold text-base text-[var(--text-primary)]">{item.name}</h4>
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">₹{item.price}</p>
                </div>
                
                {/* Quantity triggers */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500 font-medium hover:underline ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="glass-card p-6 h-fit space-y-6">
            <h3 className="text-lg font-bold">Order Summary</h3>
            <div className="border-t border-b py-4 space-y-2">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Total Items</span>
                <span>{brandCartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-2">
                <span>Subtotal</span>
                <span>₹{brandCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
              </div>
            </div>
            
            <Link href={`/${brandSlug}/checkout`} className="btn btn-primary w-full text-center">
              Proceed to Checkout
            </Link>
            
            <Link href={`/${brandSlug}/catalog`} className="btn btn-secondary w-full text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
