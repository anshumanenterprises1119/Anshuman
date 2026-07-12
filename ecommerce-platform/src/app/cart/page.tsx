'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, profile } = useAuth();
  const { cart, savedLater, updateQuantity, removeFromCart, toggleSaveLater, getCartTotal } = useCart();
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 text-gray-800">
        <p className="text-sm text-gray-500">Please sign in to view your shopping cart.</p>
        <Button onClick={() => router.push('/login')} className="px-5 py-2.5 rounded-lg text-white">Go to Login</Button>
      </div>
    );
  }

  // Calculate discounts based on user level tier
  const userLevel = profile?.level || 'bronze';
  const discountRates = {
    gold: 0.10, // 10% off
    silver: 0.05, // 5% off
    bronze: 0.00, // 0% off
  };
  const discountRate = discountRates[userLevel as 'gold' | 'silver' | 'bronze'] || 0;

  const subtotal = getCartTotal();
  const discount = subtotal * discountRate;
  const estimatedTotal = subtotal - discount;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in text-gray-850">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-gray-500 mt-1">Review active shopping items, toggle saved files, and verify discount tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Active Items List */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700">Active Bag ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">Your shopping cart is empty.</p>
            ) : (
              <div className="divide-y divide-gray-50 text-xs">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-center first:pt-0">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800 text-sm leading-snug">{item.name}</p>
                      <p className="text-[10px] text-indigo-500 capitalize">{item.type} Item</p>
                      <p className="font-mono text-gray-550">Unit: ₹{Number(item.price).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center border rounded-lg bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-150 font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-3 font-mono font-bold text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-150 font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="font-mono font-bold text-gray-800 text-sm">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSaveLater(item.id)}
                            className="text-[9px] text-indigo-600 hover:underline font-bold"
                          >
                            Save Later
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[9px] text-red-500 hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved For Later Section */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700">Saved For Later ({savedLater.length} items)</h2>
            {savedLater.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No items saved for later.</p>
            ) : (
              <div className="divide-y divide-gray-50 text-xs">
                {savedLater.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-center first:pt-0">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800 text-sm leading-snug">{item.name}</p>
                      <p className="font-mono text-gray-500">Unit: ₹{Number(item.price).toLocaleString()}</p>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="font-mono font-bold text-gray-600">₹{Number(item.price).toLocaleString()}</p>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => toggleSaveLater(item.id)}
                          className="text-[9px] text-indigo-650 hover:underline font-bold"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[9px] text-red-500 hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Summary Sidebar */}
        <aside className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-4 text-xs text-gray-600">
          <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Estimated Invoice</h3>
          
          <div className="divide-y space-y-3">
            <div className="pt-2 flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-mono font-bold text-gray-700">₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="pt-3 flex justify-between text-gray-500 items-center">
              <div>
                <span>Loyalty Discount Tier</span>
                <p className="text-[9px] text-indigo-500 font-bold uppercase mt-0.5">{userLevel} level</p>
              </div>
              <span className="font-mono font-bold text-green-600">
                {discountRate > 0 ? `-₹${discount.toLocaleString()} (${discountRate * 100}%)` : '₹0 (0%)'}
              </span>
            </div>

            <div className="pt-3 flex justify-between font-bold text-gray-800 text-sm">
              <span>Total Price</span>
              <span className="font-mono text-indigo-600">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={() => router.push('/checkout')}
            disabled={cart.length === 0}
            fullWidth
            className="text-xs py-3 rounded-lg font-bold text-white shadow-md mt-4"
          >
            Fulfill Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
}
