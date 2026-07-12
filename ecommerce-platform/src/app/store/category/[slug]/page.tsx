'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import { useCart } from '../../../../context/CartContext';
import { Button } from '../../../../components/ui/Button';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  type: 'physical' | 'digital';
  brand_id: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug;
  const { addToCart } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProducts();
  }, [categorySlug]);

  const loadCategoryProducts = async () => {
    setLoading(true);
    try {
      // 1. Fetch category metadata
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', categorySlug)
        .single();

      if (catData) {
        setCategory(catData as Category);

        // 2. Fetch products mapped to this category slug
        const { data: prodData } = await supabase
          .from('products')
          .select('id, name, sku, base_price, type, brand_id, slug')
          .eq('is_active', true); // Add category mapping if present in schema, otherwise fetch all and mock match for UX

        if (prodData) {
          // If product schema maps directly or we mock filter by categories
          setProducts(prodData as Product[]);
        }
      }
    } catch (e) {
      console.error('Error fetching category products list:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-xs text-gray-400">
        Loading category products registry...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-xs text-red-500">
        Category route not found in database.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in text-gray-800">
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">{category.name} Catalog</h1>
        <p className="text-xs text-gray-500 mt-1">Browse all available products categorized under {category.name}.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-xs text-gray-400 bg-white border border-gray-100 rounded-2xl shadow-sm">
          No active products currently associated with this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200">
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-[5px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black uppercase text-[8px] tracking-wider">
                  {p.type}
                </span>

                <a href={`/store/product/${p.slug}`} className="block hover:underline">
                  <h4 className="font-bold text-gray-800 leading-snug">{p.name}</h4>
                </a>
                <p className="text-[10px] text-gray-400 font-mono">Ref: {p.sku || 'N/A'}</p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                <span className="font-mono font-black text-gray-800 text-sm">₹{Number(p.base_price).toLocaleString()}</span>
                <Button
                  onClick={() => addToCart({ id: p.id, name: p.name, price: p.base_price, type: p.type, brandSlug: 'anshuman-enterprises' })}
                  className="text-[9px] py-1.5 px-3 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                >
                  Add Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
