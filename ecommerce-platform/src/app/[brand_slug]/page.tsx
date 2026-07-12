'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase/client';
import Link from 'next/link';

interface ProductMock {
  id: string;
  name: string;
  price: number;
  type: 'physical' | 'digital';
  category: string;
  desc: string;
  slug: string;
}

const MOCK_PRODUCTS: Record<string, ProductMock[]> = {
  'anshuman-enterprises': [
    { id: 'p101', name: 'Premium COB Ceiling Light 12W', price: 1200, type: 'physical', category: 'LED Lighting', slug: 'premium-cob-ceiling-light-12w', desc: 'High efficiency 12W COB recessed ceiling spotlight. Features a sleek aluminum heatsink and warm white output.' },
    { id: 'p102', name: 'Polycab FR House Wire 1.5 sq mm', price: 1800, type: 'physical', category: 'Wires & Cables', slug: 'polycab-fr-house-wire-1.5-sq-mm', desc: 'Flame Retardant (FR) multi-strand copper house wires. 90-meter coil. Highly conductive.' },
    { id: 'p103', name: 'KEI FRLS House Wire 2.5 sq mm', price: 2800, type: 'physical', category: 'Wires & Cables', slug: 'kei-frls-house-wire-2.5-sq-mm', desc: 'Flame Retardant Low Smoke (FRLS) 2.5 sq mm copper wire. 90-meter coil. Ideal for AC outlets.' },
    { id: 'p104', name: 'Havells Crabtree Modular Switch (Graphite)', price: 120, type: 'physical', category: 'Modular Switches', slug: 'havells-crabtree-modular-switch-graphite', desc: 'Elegant Graphite finish modular switch. 6A rating, smooth click operation with neon indicator.' },
    { id: 'p105', name: 'Legrand Myrius 6A 2-Way Switch', price: 150, type: 'physical', category: 'Modular Switches', slug: 'legrand-myrius-6a-2-way-switch', desc: 'Premium white 2-way modular switch, 6A capacity. Allows control from two separate locations.' },
    { id: 'p106', name: 'Orient LED Batten Lamp 20W', price: 350, type: 'physical', category: 'LED Lighting', slug: 'orient-led-batten-lamp-20w', desc: '20W cool day-light LED linear batten. 2000 lumens output, energy-saving design.' },
    { id: 'p107', name: 'CP Plus HD Dome Camera 2MP', price: 1850, type: 'physical', category: 'CCTV & Security', slug: 'cp-plus-hd-dome-camera-2mp', desc: '2 Megapixel HD indoor dome security camera. Night vision up to 20 meters, smart IR.' },
    { id: 'p108', name: 'Schneider Acti9 16A SP MCB', price: 450, type: 'physical', category: 'Conduit & Hardware', slug: 'schneider-acti9-16a-sp-mcb', desc: 'Acti9 single pole miniature circuit breaker (MCB), 16A capacity. Reliable overload protection.' },
    { id: 'p109', name: 'PVC Conduit Pipe 25mm (Medium)', price: 60, type: 'physical', category: 'Conduit & Hardware', slug: 'pvc-conduit-pipe-25mm-medium', desc: 'Medium gauge 25mm PVC conduit channel pipe. Flame retardant, easy bending qualities.' },
    { id: 'p110', name: 'Fingerprint Smart Door Lock (CONA)', price: 12500, type: 'physical', category: 'CCTV & Security', slug: 'fingerprint-smart-door-lock-cona', desc: 'High security smart lock supporting fingerprint recognition, mobile app unlocking, and keypad pin.' }
  ],
  'futurewithai': [
    { id: 'p201', name: 'Ultimate n8n AI Automation Pack', price: 349, type: 'digital', category: 'n8n Automation', slug: 'ultimate-n8n-ai-pack', desc: 'Ready-to-deploy LLM agent loops, autonomous lead generation pipelines, and WhatsApp integration templates.' },
    { id: 'p202', name: '400+ PHP Manually Tested Scripts', price: 499, type: 'digital', category: 'PHP scripts', slug: 'php-web-scripts-bundle', desc: 'Manually-tested lightweight PHP utility modules, database connector APIs, and custom router setups.' },
    { id: 'p203', name: 'Ultimate Web Applications Bundle', price: 999, type: 'digital', category: 'SaaS Boilerplates', slug: 'themes-plugins-ultimate', desc: 'Premium HTML templates, admin dashboards, landing pages, and Tailwind CSS templates library.' },
    { id: 'p204', name: 'Emergent Prompt Engineering Blueprint', price: 199, type: 'digital', category: 'Prompt Blueprints', slug: 'emergent-prompt-engineering', desc: 'Highly structured system prompts, chain-of-thought rules, and context templates for Claude & GPT-4.' },
    { id: 'p205', name: 'NodeJS SaaS Boilerplate & Auth Template', price: 799, type: 'digital', category: 'SaaS Boilerplates', slug: 'nodejs-saas-boilerplate', desc: 'Fully featured NodeJS boilerplate with authentication, email verification, and Stripe payment schemas.' },
    { id: 'p206', name: 'Python Autonomous Agent Scraper Suite', price: 399, type: 'digital', category: 'n8n Automation', slug: 'python-agent-scraper', desc: 'Autonomous scraper scripts using Playwright and AI extraction tools. Outputs directly to Postgres.' },
    { id: 'p207', name: 'Next.js Portfolio Tailwind Theme', price: 299, type: 'digital', category: 'SaaS Boilerplates', slug: 'nextjs-portfolio-theme', desc: 'Premium developer portfolio theme styled with Tailwind CSS, supporting dark/light mode toggle.' },
    { id: 'p208', name: 'WordPress WooCommerce Automation Plugin', price: 599, type: 'digital', category: 'n8n Automation', slug: 'wp-woocommerce-automation', desc: 'WordPress plugin connecting WooCommerce triggers to webhooks, updating discord alerts.' },
    { id: 'p209', name: 'n8n Lead Generation Pipeline Template', price: 249, type: 'digital', category: 'n8n Automation', slug: 'n8n-lead-generation-pipeline', desc: 'Automated lead scraping and validation pipeline. Enriches contacts using social profiles.' },
    { id: 'p210', name: 'PHP Database backup Automation Script', price: 149, type: 'digital', category: 'PHP scripts', slug: 'php-db-backup-automation', desc: 'Lightweight cron script backing up MySQL databases to Cloudflare R2 or Amazon S3 buckets.' }
  ]
};

const MOCK_HERO: Record<string, { title: string; subtitle: string; cta_text: string; cta_link: string; image_url: string }> = {
  'anshuman-enterprises': {
    title: 'Wholesale Electrical Supplies & Products',
    subtitle: "Direct sourcing from India's top manufacturers. Genuine products at the best market pricing. We supply hardware and commercial electrical contracting services.",
    cta_text: 'Explore Products',
    cta_link: '/anshuman-enterprises/catalog',
    image_url: '/electrical_bg_1778688113768.webp'
  },
  'futurewithai': {
    title: 'Supercharge Your Business with AI Automations',
    subtitle: 'Unlock premium n8n automation workflows, pre-tested PHP micro-apps, code templates, and ultimate web application themes. Protected vault delivery.',
    cta_text: 'Explore Templates',
    cta_link: '/futurewithai/catalog',
    image_url: '/reels_hero_mockup.webp'
  }
};

const MOCK_CATEGORIES: Record<string, string[]> = {
  'anshuman-enterprises': ['Modular Switches', 'Wires & Cables', 'LED Lighting', 'CCTV & Security', 'Conduit & Hardware'],
  'futurewithai': ['n8n Automation', 'PHP scripts', 'SaaS Boilerplates', 'Prompt Blueprints']
};

export default function BrandHomePage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<ProductMock[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hero, setHero] = useState(MOCK_HERO[brandSlug] || MOCK_HERO['anshuman-enterprises']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
    loadBrandContent();
  }, [brandSlug]);

  const loadBrandContent = async () => {
    setLoading(true);
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';
    try {
      // 1. Fetch Brand ID
      const { data: brandData, error: bErr } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brandSlug)
        .single();
        
      if (bErr || !brandData) throw new Error('Brand not found in database');

      // 2. Fetch Hero Content
      const { data: heroData } = await supabase
        .from('hero_content')
        .select('title, subtitle, cta_text, cta_link, image_url')
        .eq('brand_id', brandData.id)
        .maybeSingle();

      if (heroData) {
        setHero({
          title: heroData.title,
          subtitle: heroData.subtitle,
          cta_text: heroData.cta_text,
          cta_link: heroData.cta_link,
          image_url: heroData.image_url || MOCK_HERO[brandSlug]?.image_url || ''
        });
      } else {
        if (isProd) {
          setHero({
            title: 'Production Storefront',
            subtitle: 'Live catalogs powered by database systems.',
            cta_text: 'View Items',
            cta_link: '#products-section',
            image_url: MOCK_HERO[brandSlug]?.image_url || ''
          });
        } else {
          setHero(MOCK_HERO[brandSlug] || MOCK_HERO['anshuman-enterprises']);
        }
      }

      // 3. Fetch Categories
      const { data: catData } = await supabase
        .from('categories')
        .select('name')
        .eq('brand_id', brandData.id);

      if (catData && catData.length > 0) {
        setCategories(catData.map(c => c.name));
      } else {
        if (isProd) {
          setCategories([]);
        } else {
          setCategories(MOCK_CATEGORIES[brandSlug] || []);
        }
      }

      // 4. Fetch Products (Trending)
      const { data: prodData } = await supabase
        .from('products')
        .select('id, name, base_price, type, slug, description')
        .eq('brand_id', brandData.id)
        .eq('is_active', true)
        .limit(6);

      if (prodData && prodData.length > 0) {
        const formatted = prodData.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.base_price,
          type: p.type as any,
          category: 'Trending',
          slug: p.slug,
          desc: p.description || ''
        }));
        setProducts(formatted);
      } else {
        if (isProd) {
          setProducts([]);
        } else {
          setProducts(MOCK_PRODUCTS[brandSlug] || []);
        }
      }
    } catch (e) {
      console.error('Supabase fetch failed in page.tsx:', e);
      if (isProd) {
        setProducts([]);
        setCategories([]);
        setHero({
          title: 'Database connection failed',
          subtitle: 'Unable to reach backend database services. Running in production real data mode.',
          cta_text: 'Retry',
          cta_link: '#',
          image_url: ''
        });
      } else {
        console.warn('Supabase fetch failed. Falling back to local data blueprints. Details:', e);
        setHero(MOCK_HERO[brandSlug] || MOCK_HERO['anshuman-enterprises']);
        setCategories(MOCK_CATEGORIES[brandSlug] || []);
        setProducts(MOCK_PRODUCTS[brandSlug] || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFuture = brandSlug === 'futurewithai';

  if (isFuture) {
    // ----------------------------------------------------
    // FUTUREWITHAI DIGITAL HOMEPAGE (Dark & Premium Violet)
    // ----------------------------------------------------
    return (
      <div className="space-y-12 animate-fade-in" style={{ backgroundColor: '#0a0614', color: '#fff', margin: '-32px -16px', padding: '32px 16px' }}>
        {/* Top Sticky Announcement Banner */}
        <div className="text-center py-2.5 px-4 text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-black flex justify-center items-center gap-3 rounded-lg shadow-lg">
          <span>🎁 <strong>LIMITED TIME OFFER</strong> — Buy any automation script & get Lifetime Access + 9+ Premium Bonuses (worth ₹19,491) completely FREE!</span>
        </div>

        {/* Hero Section */}
        <section 
          className="text-center py-20 px-6 bg-gradient-to-br from-[#1a0a00]/70 to-[#0a0614] rounded-2xl border border-orange-500/10 space-y-6 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(10, 6, 20, 0.85), rgba(10, 6, 20, 0.95)), url(${hero.image_url})` }}
        >
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold uppercase tracking-widest rounded-full animate-pulse">
              ⚡ FutureWithAI Premium Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {hero.title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs pt-4">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">🛡️ Secure Payments</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">⚡ Instant Delivery</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">🔑 Lifetime Access</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">↩️ 7-Day Refund</span>
          </div>

          <div className="flex justify-center gap-4 pt-8">
            <a href={hero.cta_link}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-black font-black text-sm px-8 py-3 rounded-xl shadow-lg">
                {hero.cta_text}
              </Button>
            </a>
          </div>
        </section>

        {/* Dynamic Category List Strip */}
        <section className="space-y-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Digital Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-[#1c142c] text-orange-400 text-xs font-semibold border border-orange-500/10">
                📁 {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Featured Items Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold">Trending Releases</h3>
              <p className="text-xs text-gray-500 mt-1">Explore our top selling automation templates and digital bundles.</p>
            </div>
            <Link href="/futurewithai/catalog" className="text-sm font-semibold text-orange-500 hover:underline">
              View All Products →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500 text-xs">Loading trending items...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.slice(0, 6).map((prod) => (
                <div key={prod.id} className="border border-white/5 bg-[#120c1e] rounded-2xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition shadow-lg">
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 text-orange-500 rounded border border-white/10">
                      {prod.category}
                    </span>
                    <a href={`/futurewithai/product/${prod.slug}`} className="block hover:underline">
                      <h4 className="font-extrabold text-lg leading-snug">{prod.name}</h4>
                    </a>
                    <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">{prod.desc}</p>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">₹{prod.price}</span>
                      <span className="text-xs text-gray-500 line-through">₹{prod.price * 3}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-400 rounded">66% OFF</span>
                    </div>
                    <Button
                      fullWidth
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: prod.name,
                          price: prod.price,
                          type: 'digital',
                          brandSlug: 'futurewithai',
                        })
                      }
                    >
                      Get Instant Access
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customer Reviews Stripe */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <h4 className="text-lg font-bold text-center text-orange-500">What Our Automation Customers Say</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-[#120c1e] p-5 rounded-xl border border-white/5 space-y-2">
              <div className="text-orange-500 font-bold">★★★★★</div>
              <p className="text-gray-400 italic">&quot;n8n workflows are outstanding. Set up WhatsApp automation in 10 minutes.&quot;</p>
              <p className="text-xs font-semibold text-gray-300">— Aman Gupta, SaaS Owner</p>
            </div>
            <div className="bg-[#120c1e] p-5 rounded-xl border border-white/5 space-y-2">
              <div className="text-orange-500 font-bold">★★★★★</div>
              <p className="text-gray-400 italic">&quot;Reels bundles are top-notch. My business page grew to 50k followers in a month.&quot;</p>
              <p className="text-xs font-semibold text-gray-300">— Tanya Verma, Influencer</p>
            </div>
            <div className="bg-[#120c1e] p-5 rounded-xl border border-white/5 space-y-2">
              <div className="text-orange-500 font-bold">★★★★★</div>
              <p className="text-gray-400 italic">&quot;PHP scripts pack saved me months of dev work. Best deal for web apps.&quot;</p>
              <p className="text-xs font-semibold text-gray-300">— Vicky Sen, Freelancer</p>
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    // ----------------------------------------------------
    // ANSHUMAN ENTERPRISES HOMEPAGE (Maroon & Gold Theme)
    // ----------------------------------------------------
    return (
      <div className="space-y-12 animate-fade-in" style={{ color: '#1a1a1a' }}>
        {/* Hero Section */}
        <section 
          className="text-white rounded-2xl p-8 md:p-16 space-y-6 relative overflow-hidden shadow-lg border-b-4 border-[#c9a84c] bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(61, 14, 20, 0.8), rgba(61, 14, 20, 0.9)), url(${hero.image_url})` }}
        >
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-[#c9a84c]/20 border border-[#c9a84c] text-[#e8c96a] text-xs uppercase font-mono tracking-wider rounded-full">
              💯 100% Genuine Branded Supplies
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {hero.title}
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="text-xs font-mono bg-black/25 text-[#e8c96a] inline-block px-4 py-2 rounded">
              GSTIN Active • Sector-1 Wholesale Market
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href={hero.cta_link} className="btn btn-primary bg-[#c9a84c] text-black border-[#c9a84c] hover:bg-[#e8c96a] font-bold py-2.5 px-6 rounded-lg shadow">
              {hero.cta_text}
            </Link>
            <a href="tel:+917065815743" className="btn btn-secondary bg-transparent text-white border-white/40 hover:bg-white/10 font-bold py-2.5 px-6 rounded-lg">
              📞 Contact Wholesale Manager
            </a>
          </div>
        </section>

        {/* Categories Strip */}
        <section className="space-y-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6b1c23]">Contractor Catalog Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white text-[#6b1c23] text-xs font-bold border border-[#6b1c23]/12 shadow-sm">
                ⚙️ {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Why Us Cards Grid */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-[#4d1017]" style={{ fontFamily: 'Georgia, serif' }}>
            Why Contract Anshuman Enterprises?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 bg-white border border-[#4d1017]/10 space-y-3 shadow">
              <div className="text-3xl">🛡️</div>
              <h4 className="font-bold text-lg text-[#4d1017]">Genuine Brands Only</h4>
              <p className="text-gray-600 text-sm">We provide authentic wholesale supplies from leading brands (Havells, Polycab, Legrand) with full warranty certificates.</p>
            </div>
            <div className="glass-card p-6 bg-white border border-[#4d1017]/10 space-y-3 shadow">
              <div className="text-3xl">📦</div>
              <h4 className="font-bold text-lg text-[#4d1017]">Direct Distribution</h4>
              <p className="text-gray-600 text-sm">Get bulk order rates directly without middle-men margins. Best quote guarantees on project estimates.</p>
            </div>
            <div className="glass-card p-6 bg-white border border-[#4d1017]/10 space-y-3 shadow">
              <div className="text-3xl">🛠️</div>
              <h4 className="font-bold text-lg text-[#4d1017]">Installation Projects</h4>
              <p className="text-gray-600 text-sm">Residential wiring setups, CCTV DVR grids, and switchboards mapping handled by certified electricians.</p>
            </div>
          </div>
        </section>

        {/* Catalog Preview */}
        <section className="space-y-6 bg-white p-8 border rounded-2xl shadow-sm">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-[#4d1017]" style={{ fontFamily: 'Georgia, serif' }}>Popular Hardware</h3>
              <p className="text-gray-500 text-xs mt-1">Available for quick project supply or local Greater Noida pickup.</p>
            </div>
            <Link href="/anshuman-enterprises/catalog" className="text-sm font-semibold text-[#4d1017] hover:underline">
              View All Items →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500 text-xs">Loading catalog preview...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.slice(0, 6).map((prod) => (
                <div key={prod.id} className="border rounded-xl p-5 flex flex-col justify-between hover:border-[#c9a84c] transition shadow-sm bg-white">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-[#c9a84c]">{prod.category}</span>
                    <a href={`/anshuman-enterprises/product/${prod.slug}`} className="block hover:underline">
                      <h4 className="font-bold text-base text-[#4d1017]">{prod.name}</h4>
                    </a>
                    <p className="text-gray-650 text-xs line-clamp-3">{prod.desc}</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <p className="text-xl font-bold text-gray-900">₹{prod.price}</p>
                    <Button
                      fullWidth
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: prod.name,
                          price: prod.price,
                          type: 'physical',
                          brandSlug: 'anshuman-enterprises',
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
        </section>

        {/* Founder Quote Area */}
        <section className="border-t border-b border-[#4d1017]/10 py-10 bg-[#faf7f2] rounded-2xl px-6 flex flex-col md:flex-row items-center gap-8 shadow-inner">
          <img src="/founder.jpg" alt="Founder Aditya Tiwari" className="w-32 h-32 rounded-full border-4 border-[#c9a84c] object-cover object-top shadow-lg" onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/3d0e14/c9a84c?text=Founder';
          }} />
          <div className="space-y-2 text-center md:text-left">
            <p className="text-lg md:text-xl italic text-[#4d1017] font-serif leading-relaxed">
              &quot;Quality and trust are our first parameters. We supply Greater Noida with original wiring and security installations that guarantee home safety.&quot;
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              — Aditya Tiwari, Founder
            </p>
          </div>
        </section>
      </div>
    );
  }
}
