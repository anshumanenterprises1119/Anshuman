'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase/client';

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  type: 'physical' | 'digital';
  quantity: number;
  brandSlug: string;
}

interface CartContextType {
  cart: CartItem[];
  savedLater: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSaveLater: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedLater, setSavedLater] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync cart from database when user session changes
  useEffect(() => {
    if (user) {
      loadCartFromDb();
    } else {
      setCart([]);
      setSavedLater([]);
    }
  }, [user]);

  const loadCartFromDb = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          save_later,
          products (
            id,
            name,
            base_price,
            type,
            brand_id
          )
        `)
        .eq('profile_id', user.id);

      if (!error && data) {
        const activeItems: CartItem[] = [];
        const savedItems: CartItem[] = [];

        // Pre-fetch brands to map brand slugs correctly
        const { data: brands } = await supabase.from('brands').select('id, slug');
        const brandMap = new Map(brands?.map((b) => [b.id, b.slug]) || []);

        data.forEach((item: any) => {
          const prod = item.products;
          if (prod) {
            const cartItem: CartItem = {
              id: prod.id,
              name: prod.name,
              price: Number(prod.base_price),
              type: prod.type,
              quantity: item.quantity,
              brandSlug: brandMap.get(prod.brand_id) || 'anshuman-enterprises',
            };
            if (item.save_later) {
              savedItems.push(cartItem);
            } else {
              activeItems.push(cartItem);
            }
          }
        });

        setCart(activeItems);
        setSavedLater(savedItems);
      }
    } catch (e) {
      console.error('Error fetching persistent cart:', e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      alert('Please log in to add items to your shopping cart.');
      return;
    }
    try {
      const existing = cart.find((item) => item.id === newItem.id);
      const newQty = existing ? existing.quantity + 1 : 1;

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          profile_id: user.id,
          product_id: newItem.id,
          quantity: newQty,
          save_later: false,
        }, { onConflict: 'profile_id,product_id' });

      if (error) throw error;
      await loadCartFromDb();
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('profile_id', user.id)
        .eq('product_id', itemId);

      if (error) throw error;
      await loadCartFromDb();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('profile_id', user.id)
        .eq('product_id', itemId);

      if (error) throw error;
      await loadCartFromDb();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const toggleSaveLater = async (itemId: string) => {
    if (!user) return;
    const isActive = cart.some((item) => item.id === itemId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ save_later: isActive })
        .eq('profile_id', user.id)
        .eq('product_id', itemId);

      if (error) throw error;
      await loadCartFromDb();
    } catch (err) {
      console.error('Error toggling save later:', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('profile_id', user.id)
        .eq('save_later', false);

      if (error) throw error;
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        savedLater,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSaveLater,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
