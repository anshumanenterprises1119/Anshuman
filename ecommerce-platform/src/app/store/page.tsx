'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  type: 'physical' | 'digital';
  brand_id: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function StoreFrontPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);

  // Compare State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Search Suggestions and History State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadStoreMetadata();
  }, []);

  useEffect(() => {
    loadFilteredProducts();
  }, [search, selectedBrandId, selectedCategoryId, selectedType, maxPrice]);

  // Debounced search history logging
  useEffect(() => {
    if (!search.trim()) return;

    const logHistory = setTimeout(async () => {
      try {
        await supabase.from('search_history').insert({
          profile_id: user?.id || null,
          query: search.trim(),
        });
      } catch (err) {
        console.error('Failed to log search history:', err);
      }
    }, 1200);

    return () => clearTimeout(logHistory);
  }, [search, user]);

  // Generate suggestions based on matches
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const term = search.toLowerCase();
    const matches = new Set<string>();

    products.forEach((p) => {
      if (p.name.toLowerCase().includes(term)) {
        matches.add(p.name);
      }
    });

    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(term)) {
        matches.add(c.name);
      }
    });

    const commonKeywords = ['n8n', 'switches', 'lights', 'modular', 'digital', 'cctv', 'cables'];
    commonKeywords.forEach((k) => {
      if (k.includes(term)) {
        matches.add(k);
      }
    });

    setSuggestions(Array.from(matches).slice(0, 5));
  }, [search, products, categories]);

  const loadStoreMetadata = async () => {
    try {
      const { data: bData } = await supabase.from('brands').select('id, name, slug');
      if (bData) setBrands(bData as Brand[]);

      const { data: cData } = await supabase.from('categories').select('id, name, slug');
      if (cData) setCategories(cData as Category[]);
    } catch (e) {
      console.error('Error loading store metadata:', e);
    }
  };

  const loadFilteredProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('id, name, sku, base_price, type, brand_id, slug').eq('is_active', true);

      if (selectedBrandId) {
        query = query.eq('brand_id', selectedBrandId);
      }
      if (selectedType) {
        query = query.eq('type', selectedType);
      }

      const { data } = await query;
      if (data) {
        let list = data as Product[];
        
        // Filter by price range
        list = list.filter((p) => Number(p.base_price) <= maxPrice);

        // Filter by category (via categories mapping table if complex, here we check simple matches)
        if (selectedCategoryId) {
          // Simplification for catalog route filter mapping
        }

        // Filter by keyword search and weight results
        if (search) {
          const term = search.toLowerCase().trim();
          const weightedList = list.map((p) => {
            let weight = 0;
            const nameLower = p.name.toLowerCase();
            
            if (nameLower === term) {
              weight += 100; // Exact match
            } else if (nameLower.startsWith(term)) {
              weight += 50; // Starts with search term
            } else if (nameLower.includes(term)) {
              weight += 20; // Contains search term
            }
            
            if (p.sku && p.sku.toLowerCase() === term) {
              weight += 80; // SKU match
            }

            return { product: p, weight };
          });

          // Sort by weight descending, keeping only those with weight > 0
          list = weightedList
            .filter((item) => item.weight > 0)
            .sort((a, b) => b.weight - a.weight)
            .map((item) => item.product);
        }

        setProducts(list);
      }
    } catch (e) {
      console.error('Error loading products list:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 products at a time.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const triggerCompareModal = async () => {
    if (compareIds.length === 0) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('id, name, sku, base_price, type, brand_id, slug')
        .in('id', compareIds);
      
      if (data) {
        setCompareProducts(data as Product[]);
        setShowCompareModal(true);

        // Log comparison details in product_compare database table
        if (user) {
          for (const pid of compareIds) {
            await supabase.from('product_compare').upsert({
              profile_id: user.id,
              product_id: pid,
            }, { onConflict: 'profile_id,product_id' });
          }
        }
      }
    } catch (err) {
      console.error('Compare fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in text-gray-800">
      
      {/* Search and comparison header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-850 tracking-tight">Store Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Explore our range of premium mechanical parts, modular boards, and files.</p>
        </div>

        <div className="flex gap-3">
          {compareIds.length > 0 && (
            <Button
              onClick={triggerCompareModal}
              className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition"
            >
              📊 Compare Selected ({compareIds.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Filters Panel */}
        <aside className="space-y-6 bg-white border border-gray-150 p-6 rounded-2xl h-fit shadow-sm">
          <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Advanced Filters</h3>

          <div className="relative">
            <Input
              label="Search Catalog"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Type search keyword..."
              className="text-xs bg-gray-50 border-gray-200"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto divide-y divide-gray-50">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearch(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer text-xs text-gray-700 transition"
                  >
                    🔍 {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Logistics Brand</label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-indigo-500"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Asset Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-indigo-500"
            >
              <option value="">All Types</option>
              <option value="physical">Physical Parts</option>
              <option value="digital">Digital Assets</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-gray-400">
              <span>Maximum Price</span>
              <span className="font-mono text-gray-800 font-bold">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={150000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <Button
            onClick={() => {
              setSearch('');
              setSelectedBrandId('');
              setSelectedCategoryId('');
              setSelectedType('');
              setMaxPrice(100000);
            }}
            variant="outline"
            fullWidth
            className="text-[10px] py-2 rounded-lg font-bold"
          >
            Reset Filters
          </Button>
        </aside>

        {/* Product Cards Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-16 text-xs text-gray-400">Syncing products registry...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-xs text-gray-400 bg-white border border-gray-100 rounded-2xl shadow-sm">
              No matching products found. Try adjusting filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => {
                const isCompared = compareIds.includes(p.id);
                return (
                  <div key={p.id} className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-[5px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black uppercase text-[8px] tracking-wider">
                          {p.type}
                        </span>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-400 hover:text-gray-700 select-none">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => handleToggleCompare(p.id)}
                            className="accent-indigo-600"
                          />
                          Compare
                        </label>
                      </div>

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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border w-full max-w-3xl rounded-2xl shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto text-xs text-gray-700">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-gray-800 text-sm">Product Specifications Comparison</h3>
              <Button onClick={() => setShowCompareModal(false)} variant="secondary" className="text-[10px] py-1 px-3 rounded-lg">Close</Button>
            </div>

            <div className="grid grid-cols-4 gap-4 divide-x">
              <div className="font-bold text-gray-400 flex flex-col justify-around py-4">
                <span>Product Name</span>
                <span>Type Tag</span>
                <span>SKU Code</span>
                <span>Base Price</span>
              </div>
              {compareProducts.map((p) => (
                <div key={p.id} className="pl-4 space-y-8 flex flex-col justify-around py-4">
                  <span className="font-bold text-gray-800 leading-snug">{p.name}</span>
                  <span className="capitalize">{p.type}</span>
                  <span className="font-mono text-gray-500">{p.sku || 'N/A'}</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">₹{Number(p.base_price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
