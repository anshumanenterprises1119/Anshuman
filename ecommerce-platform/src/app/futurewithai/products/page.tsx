'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  type: 'physical' | 'digital';
  slug: string;
}

export default function DigitalProductsCatalogPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDigitalProducts();
  }, []);

  const loadDigitalProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, base_price, type, slug')
        .eq('type', 'digital')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        seedAndGetMockProducts();
      }
    } catch (e) {
      seedAndGetMockProducts();
    } finally {
      setLoading(false);
    }
  };

  const seedAndGetMockProducts = () => {
    setProducts([
      {
        id: 'd1c6b1c6-2c5e-4029-9a2e-c1e1bc89a74a',
        name: 'Ultimate n8n AI Automation Pack',
        sku: 'N8N-AI-PACK',
        base_price: 349,
        type: 'digital',
        slug: 'ultimate-n8n-ai-pack'
      },
      {
        id: 'd8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8',
        name: '400+ PHP Manually-Tested Web Scripts',
        sku: 'PHP-SCRIPTS-400',
        base_price: 499,
        type: 'digital',
        slug: 'php-web-scripts-bundle'
      },
      {
        id: 'd5c2a1b0-3c2f-4b1a-8e2b-f3b184cc89a2',
        name: 'Ultimate Web Applications Themes & Plugins',
        sku: 'THEMES-PLUGINS-ULT',
        base_price: 999,
        type: 'digital',
        slug: 'themes-plugins-ultimate'
      }
    ]);
  };

  const handleMockBuy = async (product: Product) => {
    if (!user) {
      alert('Please log in as a customer first to purchase digital assets.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      // 1. Check/create a mock order ID
      const mockOrderId = 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a'; // Default simulated Order UUID

      // 2. Grant purchase access
      const { error: accessError } = await supabase.from('purchase_access').upsert({
        profile_id: user.id,
        product_id: product.id,
        order_id: mockOrderId,
        is_active: true
      }, { onConflict: 'profile_id,product_id' });

      if (accessError) throw accessError;

      // 3. Create key in licenses table
      const mockKey = `FWAI-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const { error: licenseError } = await supabase.from('licenses').upsert({
        profile_id: user.id,
        product_id: product.id,
        license_key: mockKey,
        status: 'active'
      }, { onConflict: 'license_key' });

      // 4. Create mock digital asset if not exists
      await supabase.from('digital_assets').upsert({
        id: product.id, // Let's map it 1-to-1 for ease of fetching
        product_id: product.id,
        file_path: `cloudflare-r2/vault/downloads/${product.slug}.zip`,
        file_name: `${product.slug}.zip`,
        file_size: 15728640 // 15MB
      }, { onConflict: 'id' });

      alert(`Purchase simulation successful! Unlocked "${product.name}". Open your digital library to download.`);
      window.location.href = '/futurewithai/library';
    } catch (err: any) {
      console.warn('DB mapping failed. Saved to client memory (Simulation Mode). Details:', err.message);
      
      // Save simulated purchase to localStorage for seamless UX preview if DB is not migrated
      const savedPurchases = JSON.parse(localStorage.getItem('simulated_purchases') || '[]');
      savedPurchases.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        license: `MOCK-KEY-SIM-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      });
      localStorage.setItem('simulated_purchases', JSON.stringify(savedPurchases));

      alert(`Purchase simulation successful (Simulation Mode)! Unlocked "${product.name}" in client cache.`);
      window.location.href = '/futurewithai/library';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-850 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              FutureWithAI Catalog
            </h1>
            <p className="text-xs text-gray-400 mt-1">Get immediate licensing keys and download packages.</p>
          </div>
          <a href="/futurewithai/library">
            <Button variant="outline" className="border-indigo-900 text-indigo-400 hover:bg-indigo-950/50 text-xs py-2">
              📂 Go to My Digital Library
            </Button>
          </a>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Loading catalog items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-[#111827] border border-[#1f2937] hover:border-indigo-500/50 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition" />
                
                <div className="space-y-4 relative">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-950/75 border border-indigo-900 text-indigo-400 text-[8px] font-black tracking-widest uppercase">
                    Digital Bundle
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug hover:text-indigo-400 transition">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">Reference SKU: {p.sku || 'N/A'}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1f2937] flex items-center justify-between relative">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Base Price</span>
                    <span className="font-mono font-black text-white text-base">₹{p.base_price.toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => handleMockBuy(p)}
                    className="bg-indigo-650 hover:bg-indigo-600 text-xs font-bold py-2 px-5 rounded-xl shadow-md transition"
                  >
                    Unlock Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
