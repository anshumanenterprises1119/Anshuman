'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    name: string;
    base_price: number;
    type: 'physical' | 'digital';
    sku: string | null;
  } | null;
}

export default function CustomerWishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const { data } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (
            name,
            base_price,
            type,
            sku
          )
        `)
        .eq('profile_id', user.id);

      if (data) setWishlist(data as unknown as WishlistItem[]);
    } catch (err) {
      console.error('Error loading customer wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;
      loadWishlist();
    } catch (err: any) {
      console.error('Error removing item from wishlist:', err);
      alert(err.message || 'Failed to remove item.');
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-400">Syncing wishlist list...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Saved Items</h1>
        <p className="text-xs text-gray-500 mt-1">Review and manage your wishlisted products catalog.</p>
      </div>

      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        {wishlist.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">Your wishlist is currently empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {wishlist.map((item) => {
              const prod = item.products;
              if (!prod) return null;
              return (
                <div key={item.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-start bg-gray-50 hover:bg-white hover:border-gray-200 transition duration-150 shadow-sm">
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-snug">{prod.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Ref: {prod.sku || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-[5px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold uppercase text-[9px]">
                        {prod.type}
                      </span>
                      <span className="font-mono font-bold text-gray-800 mt-0.5">₹{Number(prod.base_price).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:underline font-bold text-[10px]"
                  >
                    Remove Item
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
