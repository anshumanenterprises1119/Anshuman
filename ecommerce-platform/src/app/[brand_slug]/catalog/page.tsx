'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useCart } from '../../../context/CartContext';
import { Button } from '../../../components/ui/Button';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  sale_price: number | null;
  type: 'physical' | 'digital';
  category: string;
}

interface Category {
  id: string;
  name: string;
}

const MOCK_CATEGORIES: Record<string, string[]> = {
  'anshuman-enterprises': ['Modular Switches', 'Wires & Cables', 'LED Lighting', 'CCTV & Security', 'Conduit & Hardware'],
  'futurewithai': ['n8n Automation', 'PHP scripts', 'SaaS Boilerplates', 'Prompt Blueprints']
};

const MOCK_PRODUCTS: Record<string, Product[]> = {
  'anshuman-enterprises': [
    { id: 'p101', name: 'Premium COB Ceiling Light 12W', slug: 'premium-cob-ceiling-light-12w', base_price: 1200, sale_price: null, type: 'physical', category: 'LED Lighting', description: 'High efficiency 12W COB recessed ceiling spotlight. Features a sleek aluminum heatsink and warm white output.' },
    { id: 'p102', name: 'Polycab FR House Wire 1.5 sq mm', slug: 'polycab-fr-house-wire-1.5-sq-mm', base_price: 1800, sale_price: null, type: 'physical', category: 'Wires & Cables', description: 'Flame Retardant (FR) multi-strand copper house wires. 90-meter coil. Highly conductive.' },
    { id: 'p103', name: 'KEI FRLS House Wire 2.5 sq mm', slug: 'kei-frls-house-wire-2.5-sq-mm', base_price: 2800, sale_price: null, type: 'physical', category: 'Wires & Cables', description: 'Flame Retardant Low Smoke (FRLS) 2.5 sq mm copper wire. 90-meter coil. Ideal for AC outlets.' },
    { id: 'p104', name: 'Havells Crabtree Modular Switch (Graphite)', slug: 'havells-crabtree-modular-switch-graphite', base_price: 120, sale_price: null, type: 'physical', category: 'Modular Switches', description: 'Elegant Graphite finish modular switch. 6A rating, smooth click operation with neon indicator.' },
    { id: 'p105', name: 'Legrand Myrius 6A 2-Way Switch', slug: 'legrand-myrius-6a-2-way-switch', base_price: 150, sale_price: null, type: 'physical', category: 'Modular Switches', description: 'Premium white 2-way modular switch, 6A capacity. Allows control from two separate locations.' },
    { id: 'p106', name: 'Orient LED Batten Lamp 20W', slug: 'orient-led-batten-lamp-20w', base_price: 350, sale_price: null, type: 'physical', category: 'LED Lighting', description: '20W cool day-light LED linear batten. 2000 lumens output, energy-saving design.' },
    { id: 'p107', name: 'CP Plus HD Dome Camera 2MP', slug: 'cp-plus-hd-dome-camera-2mp', base_price: 1850, sale_price: null, type: 'physical', category: 'CCTV & Security', description: '2 Megapixel HD indoor dome security camera. Night vision up to 20 meters, smart IR.' },
    { id: 'p108', name: 'Schneider Acti9 16A SP MCB', slug: 'schneider-acti9-16a-sp-mcb', base_price: 450, sale_price: null, type: 'physical', category: 'Conduit & Hardware', description: 'Acti9 single pole miniature circuit breaker (MCB), 16A capacity. Reliable overload protection.' },
    { id: 'p109', name: 'PVC Conduit Pipe 25mm (Medium)', slug: 'pvc-conduit-pipe-25mm-medium', base_price: 60, sale_price: null, type: 'physical', category: 'Conduit & Hardware', description: 'Medium gauge 25mm PVC conduit channel pipe. Flame retardant, easy bending qualities.' },
    { id: 'p110', name: 'Fingerprint Smart Door Lock (CONA)', slug: 'fingerprint-smart-door-lock-cona', base_price: 12500, sale_price: null, type: 'physical', category: 'CCTV & Security', description: 'High security smart lock supporting fingerprint recognition, mobile app unlocking, and keypad pin.' }
  ],
  'futurewithai': [
    { id: 'p201', name: 'Ultimate n8n AI Automation Pack', slug: 'ultimate-n8n-ai-pack', base_price: 349, sale_price: null, type: 'digital', category: 'n8n Automation', description: 'Ready-to-deploy LLM agent loops, autonomous lead generation pipelines, and WhatsApp integration templates.' },
    { id: 'p202', name: '400+ PHP Manually Tested Scripts', slug: 'php-web-scripts-bundle', base_price: 499, sale_price: null, type: 'digital', category: 'PHP scripts', description: 'Manually-tested lightweight PHP utility modules, database connector APIs, and custom router setups.' },
    { id: 'p203', name: 'Ultimate Web Applications Bundle', slug: 'themes-plugins-ultimate', base_price: 999, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', description: 'Premium HTML templates, admin dashboards, landing pages, and Tailwind CSS templates library.' },
    { id: 'p204', name: 'Emergent Prompt Engineering Blueprint', slug: 'emergent-prompt-engineering', base_price: 199, sale_price: null, type: 'digital', category: 'Prompt Blueprints', description: 'Highly structured system prompts, chain-of-thought rules, and context templates for Claude & GPT-4.' },
    { id: 'p205', name: 'NodeJS SaaS Boilerplate & Auth Template', slug: 'nodejs-saas-boilerplate', base_price: 799, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', description: 'Fully featured NodeJS boilerplate with authentication, email verification, and Stripe payment schemas.' },
    { id: 'p206', name: 'Python Autonomous Agent Scraper Suite', slug: 'python-agent-scraper', base_price: 399, sale_price: null, type: 'digital', category: 'n8n Automation', description: 'Autonomous scraper scripts using Playwright and AI extraction tools. Outputs directly to Postgres.' },
    { id: 'p207', name: 'Next.js Portfolio Tailwind Theme', slug: 'nextjs-portfolio-theme', base_price: 299, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', description: 'Premium developer portfolio theme styled with Tailwind CSS, supporting dark/light mode toggle.' },
    { id: 'p208', name: 'WordPress WooCommerce Automation Plugin', slug: 'wp-woocommerce-automation', base_price: 599, sale_price: null, type: 'digital', category: 'n8n Automation', description: 'WordPress plugin connecting WooCommerce triggers to webhooks, updating discord alerts.' },
    { id: 'p209', name: 'n8n Lead Generation Pipeline Template', slug: 'n8n-lead-generation-pipeline', base_price: 249, sale_price: null, type: 'digital', category: 'n8n Automation', description: 'Automated lead scraping and validation pipeline. Enriches contacts using social profiles.' },
    { id: 'p210', name: 'PHP Database backup Automation Script', slug: 'php-db-backup-automation', base_price: 149, sale_price: null, type: 'digital', category: 'PHP scripts', description: 'Lightweight cron script backing up MySQL databases to Cloudflare R2 or Amazon S3 buckets.' }
  ]
};

export default function CatalogPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
    loadCatalog();
  }, [brandSlug]);

  const loadCatalog = async () => {
    setLoading(true);
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';
    try {
      // 1. Fetch brand details
      const { data: brandData, error: bErr } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brandSlug)
        .single();
        
      if (bErr || !brandData) throw new Error('Brand not found in Postgres');
      
      // 2. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('brand_id', brandData.id);
      
      if (catData && catData.length > 0) {
        setCategories(catData as Category[]);
      } else {
        if (isProd) {
          setCategories([]);
        } else {
          // Build mock categories list with IDs
          const mockCats = (MOCK_CATEGORIES[brandSlug] || []).map((name, idx) => ({
            id: `cat_${idx}`,
            name
          }));
          setCategories(mockCats);
        }
      }

      // 3. Fetch products
      const { data: prodData } = await supabase
        .from('products')
        .select('id, name, slug, description, base_price, sale_price, type')
        .eq('brand_id', brandData.id)
        .eq('is_active', true);

      if (prodData && prodData.length > 0) {
        // Map dynamic products, parsing category
        const mapped = prodData.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          base_price: p.base_price,
          sale_price: p.sale_price,
          type: p.type as any,
          category: 'Trending'
        }));
        setProducts(mapped);
      } else {
        if (isProd) {
          setProducts([]);
        } else {
          setProducts(MOCK_PRODUCTS[brandSlug] || []);
        }
      }
    } catch (e) {
      console.error('Supabase fetch failed in catalog/page.tsx:', e);
      if (isProd) {
        setCategories([]);
        setProducts([]);
      } else {
        console.warn('Supabase fetch failed. Falling back to local data blueprints. Details:', e);
        const mockCats = (MOCK_CATEGORIES[brandSlug] || []).map((name, idx) => ({
          id: `cat_${idx}`,
          name
        }));
        setCategories(mockCats);
        setProducts(MOCK_PRODUCTS[brandSlug] || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory.startsWith('cat_') 
        ? prod.category === categories.find(c => c.id === selectedCategory)?.name
        : false);
        
    return matchesSearch && (selectedCategory === 'all' || prod.category === selectedCategory || matchesCategory);
  });

  return (
    <div className="space-y-8 animate-fade-in text-gray-800">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Our Catalog</h2>
          <p className="text-gray-500 text-xs mt-1">
            Browse through premium offerings from {brandSlug === 'futurewithai' ? 'FutureWithAI' : 'Anshuman Enterprises'}.
          </p>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            className="form-input text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="glass-card bg-white p-6 border rounded-2xl shadow-sm">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-gray-400">Categories</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                    : 'hover:bg-gray-50 text-gray-650'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat.name
                      ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                      : 'hover:bg-gray-50 text-gray-650'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs bg-white border border-gray-100 rounded-2xl shadow-sm">No products match your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="glass-card bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between h-full shadow-sm hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md">
                        {prod.type}
                      </span>
                      <span className="text-[8px] font-bold text-gray-400">
                        {prod.category}
                      </span>
                    </div>
                    <a
                      href={`/${brandSlug}/product/${prod.slug}`}
                      className="block mt-4 text-base font-bold text-gray-800 hover:underline leading-snug"
                    >
                      {prod.name}
                    </a>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {prod.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="mt-6 space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-mono font-black text-gray-800">
                        ₹{prod.sale_price || prod.base_price}
                      </span>
                      {prod.sale_price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{prod.base_price}
                        </span>
                      )}
                    </div>
                    <Button
                      fullWidth
                      className="text-xs py-2 rounded-lg text-white"
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: prod.name,
                          price: prod.sale_price || prod.base_price,
                          type: prod.type,
                          brandSlug: brandSlug,
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
