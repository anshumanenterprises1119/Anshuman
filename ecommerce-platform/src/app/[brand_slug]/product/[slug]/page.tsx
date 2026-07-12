'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import { useCart } from '../../../../context/CartContext';
import { Button } from '../../../../components/ui/Button';

interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  sale_price: number | null;
  type: 'physical' | 'digital';
  sku: string | null;
  metadata: Record<string, any>;
  category: string;
  slug: string;
}

const MOCK_PRODUCTS: Record<string, ProductDetail[]> = {
  'anshuman-enterprises': [
    { id: 'p101', name: 'Premium COB Ceiling Light 12W', slug: 'premium-cob-ceiling-light-12w', base_price: 1200, sale_price: null, type: 'physical', category: 'LED Lighting', sku: 'AE-COB-LED-01', metadata: { Wattage: '12W', Certification: 'ISI Standard', Lifetime: '50,000 Hours' }, description: 'High efficiency 12W COB recessed ceiling spotlight. Features a sleek aluminum heatsink, anti-glare reflector, and warm white output. Ideal for commercial offices and premium residences.' },
    { id: 'p102', name: 'Polycab FR House Wire 1.5 sq mm', slug: 'polycab-fr-house-wire-1.5-sq-mm', base_price: 1800, sale_price: null, type: 'physical', category: 'Wires & Cables', sku: 'AE-POL-FR-15', metadata: { Length: '90 Meters', Conductor: 'Copper', Gauge: '1.5 sq mm' }, description: 'Flame Retardant (FR) multi-strand copper house wires. 90-meter coil. Highly conductive, heat resistant, and certified to ISI standards for safe domestic piping electrical cabling.' },
    { id: 'p103', name: 'KEI FRLS House Wire 2.5 sq mm', slug: 'kei-frls-house-wire-2.5-sq-mm', base_price: 2800, sale_price: null, type: 'physical', category: 'Wires & Cables', sku: 'AE-KEI-FRLS-25', metadata: { Length: '90 Meters', Conductor: 'Copper', Gauge: '2.5 sq mm' }, description: 'Flame Retardant Low Smoke (FRLS) 2.5 sq mm copper wire. 90-meter coil. High safety margin, low smoke emission during fires. Perfect for high-load kitchen and AC power sockets.' },
    { id: 'p104', name: 'Havells Crabtree Modular Switch (Graphite)', slug: 'havells-crabtree-modular-switch-graphite', base_price: 120, sale_price: null, type: 'physical', category: 'Modular Switches', sku: 'AE-HAV-CS-06', metadata: { Finish: 'Graphite Grey', Rating: '6A', Type: '1-Way Switch' }, description: 'Elegant Graphite finish modular switch. 6A rating, smooth click operation with neon indicator. Blends beautifully with modern interior wall designs.' },
    { id: 'p105', name: 'Legrand Myrius 6A 2-Way Switch', slug: 'legrand-myrius-6a-2-way-switch', base_price: 150, sale_price: null, type: 'physical', category: 'Modular Switches', sku: 'AE-LEG-MY-2W', metadata: { Finish: 'White Matte', Rating: '6A', Type: '2-Way Switch' }, description: 'Premium white 2-way modular switch, 6A capacity. Allows control from two separate locations (e.g. staircases).' },
    { id: 'p106', name: 'Orient LED Batten Lamp 20W', slug: 'orient-led-batten-lamp-20w', base_price: 350, sale_price: null, type: 'physical', category: 'LED Lighting', sku: 'AE-ORI-BAT-20', metadata: { Wattage: '20W', Length: '4 Feet', Output: '2000 Lumens' }, description: '20W cool day-light LED linear batten. 2000 lumens output, energy-saving design, flicker-free startup.' },
    { id: 'p107', name: 'CP Plus HD Dome Camera 2MP', slug: 'cp-plus-hd-dome-camera-2mp', base_price: 1850, sale_price: null, type: 'physical', category: 'CCTV & Security', sku: 'AE-CPP-DOM-02', metadata: { Resolution: '2MP (1080p)', Type: 'Indoor Dome', Range: '20 Meters' }, description: '2 Megapixel HD indoor dome security camera. Night vision up to 20 meters, smart IR, wide-angle lens.' },
    { id: 'p108', name: 'Schneider Acti9 16A SP MCB', slug: 'schneider-acti9-16a-sp-mcb', base_price: 450, sale_price: null, type: 'physical', category: 'Conduit & Hardware', sku: 'AE-SCH-MCB-16', metadata: { Poles: 'Single Pole', Rating: '16A', Curve: 'C-Curve' }, description: 'Acti9 single pole miniature circuit breaker (MCB), 16A capacity. Provides class-leading overload and short circuit protection.' },
    { id: 'p109', name: 'PVC Conduit Pipe 25mm (Medium)', slug: 'pvc-conduit-pipe-25mm-medium', base_price: 60, sale_price: null, type: 'physical', category: 'Conduit & Hardware', sku: 'AE-PVC-CON-25', metadata: { Diameter: '25mm', Material: 'Medium PVC', Color: 'Black/Grey' }, description: 'Medium gauge 25mm PVC conduit channel pipe. Flame retardant, high impact strength, and easy bending qualities.' },
    { id: 'p110', name: 'Fingerprint Smart Door Lock (CONA)', slug: 'fingerprint-smart-door-lock-cona', base_price: 12500, sale_price: null, type: 'physical', category: 'CCTV & Security', sku: 'AE-CON-SDL-01', metadata: { Modes: 'Fingerprint, App, Code, Card', Deadbolt: 'Heavy Duty Metallic' }, description: 'High security smart lock supporting fingerprint recognition, mobile app unlocking, keypad pin, and physical backup key.' }
  ],
  'futurewithai': [
    { id: 'p201', name: 'Ultimate n8n AI Automation Pack', slug: 'ultimate-n8n-ai-pack', base_price: 349, sale_price: null, type: 'digital', category: 'n8n Automation', sku: 'FWAI-N8N-AI-PACK', metadata: { Platform: 'n8n self-hosted / cloud', Workflows: '40+ workflows', Deliverable: 'ZIP source files' }, description: 'Ready-to-deploy LLM agent loops, autonomous lead generation pipelines, and WhatsApp integration templates. Set up in 10 minutes.' },
    { id: 'p202', name: '400+ PHP Manually Tested Scripts', slug: 'php-web-scripts-bundle', base_price: 499, sale_price: null, type: 'digital', category: 'PHP scripts', sku: 'FWAI-PHP-SCRIPTS', metadata: { Version: 'PHP 8.x compatible', Count: '400+ scripts', Format: 'ZIP file' }, description: 'Manually-tested lightweight PHP utility modules, database connector APIs, and custom router setups.' },
    { id: 'p203', name: 'Ultimate Web Applications Bundle', slug: 'themes-plugins-ultimate', base_price: 999, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', sku: 'FWAI-WEB-APPS', metadata: { Styles: 'Tailwind CSS, HTML5', Templates: '30+ layouts', Responsive: 'Yes' }, description: 'Premium HTML templates, admin dashboards, landing pages, and Tailwind CSS templates library. Ready to launch.' },
    { id: 'p204', name: 'Emergent Prompt Engineering Blueprint', slug: 'emergent-prompt-engineering', base_price: 199, sale_price: null, type: 'digital', category: 'Prompt Blueprints', sku: 'FWAI-PROMPT-ENG', metadata: { Engines: 'GPT-4, Claude 3.5, Gemini', Format: 'PDF / Markdown', Sections: '12 chapters' }, description: 'Highly structured system prompts, chain-of-thought rules, and context templates for LLMs.' },
    { id: 'p205', name: 'NodeJS SaaS Boilerplate & Auth Template', slug: 'nodejs-saas-boilerplate', base_price: 799, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', sku: 'FWAI-NODE-SAAS', metadata: { Runtime: 'NodeJS v20+', Database: 'PostgreSQL / Prisma', Auth: 'NextAuth / JWT' }, description: 'Fully featured NodeJS boilerplate with authentication, email verification, and Stripe payment schemas.' },
    { id: 'p206', name: 'Python Autonomous Agent Scraper Suite', slug: 'python-agent-scraper', base_price: 399, sale_price: null, type: 'digital', category: 'n8n Automation', sku: 'FWAI-PY-SCRAPE', metadata: { Engine: 'Playwright / BeautifulSoup', Format: 'Python 3.11', Outputs: 'Postgres / CSV' }, description: 'Autonomous scraper scripts using Playwright and AI extraction tools. Clean database output.' },
    { id: 'p207', name: 'Next.js Portfolio Tailwind Theme', slug: 'nextjs-portfolio-theme', base_price: 299, sale_price: null, type: 'digital', category: 'SaaS Boilerplates', sku: 'FWAI-NEXT-PORT', metadata: { Framework: 'Next.js 14 App Router', Styling: 'Tailwind CSS', Features: 'Framer Motion, Dark Mode' }, description: 'Premium developer portfolio theme styled with Tailwind CSS, supporting dark/light mode toggle.' },
    { id: 'p208', name: 'WordPress WooCommerce Automation Plugin', slug: 'wp-woocommerce-automation', base_price: 599, sale_price: null, type: 'digital', category: 'n8n Automation', sku: 'FWAI-WP-WOO', metadata: { CMS: 'WordPress 6.x', Ecom: 'WooCommerce 8.x', Connectors: 'Discord, Sheets' }, description: 'WordPress plugin connecting WooCommerce triggers to webhooks, updating discord alerts.' },
    { id: 'p209', name: 'n8n Lead Generation Pipeline Template', slug: 'n8n-lead-generation-pipeline', base_price: 249, sale_price: null, type: 'digital', category: 'n8n Automation', sku: 'FWAI-N8N-LEAD', metadata: { Nodes: 'HTTP Request, Sheets, CRMs', Automation: 'Lead Enrichment' }, description: 'Automated lead scraping and validation pipeline. Enriches contacts using social profiles.' },
    { id: 'p210', name: 'PHP Database backup Automation Script', slug: 'php-db-backup-automation', base_price: 149, sale_price: null, type: 'digital', category: 'PHP scripts', sku: 'FWAI-PHP-BACKUP', metadata: { ScriptType: 'Lightweight CLI Cron', Backups: 'Cloudflare R2, S3', Notification: 'Email log' }, description: 'Lightweight cron script backing up MySQL databases to Cloudflare R2 or Amazon S3 buckets.' }
  ]
};

export default function ProductDetailPage({
  params,
}: {
  params: { brand_slug: string; slug: string };
}) {
  const { brand_slug, slug } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [inventoryCount, setInventoryCount] = useState<number | null>(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand_slug);
    loadProduct();
  }, [brand_slug, slug]);

  const loadProduct = async () => {
    setLoading(true);
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';
    try {
      // 1. Fetch brand
      const { data: brand, error: bErr } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brand_slug)
        .single();

      if (bErr || !brand) throw new Error('Brand not found');

      // 2. Fetch product by brand and slug
      const { data: prod } = await supabase
        .from('products')
        .select('id, name, description, base_price, sale_price, type, sku, metadata')
        .eq('brand_id', brand.id)
        .eq('slug', slug)
        .single();

      if (prod) {
        setProduct(prod as ProductDetail);

        // 3. If physical, check inventory
        if (prod.type === 'physical') {
          const { data: inv } = await supabase
            .from('inventory')
            .select('quantity')
            .eq('product_id', prod.id)
            .single();
          if (inv) setInventoryCount(inv.quantity);
        }
      } else {
        if (isProd) {
          setProduct(null);
        } else {
          // Fallback to local list if product query is empty
          const found = (MOCK_PRODUCTS[brand_slug] || []).find(p => p.slug === slug);
          if (found) setProduct(found);
        }
      }
    } catch (e) {
      console.error('Supabase fetch failed in product/[slug]/page.tsx:', e);
      if (isProd) {
        setProduct(null);
      } else {
        console.warn('Supabase fetch failed. Falling back to local data blueprints. Details:', e);
        const found = (MOCK_PRODUCTS[brand_slug] || []).find(p => p.slug === slug);
        if (found) {
          setProduct(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] text-xs">Loading product info...</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-red-500 text-xs">Product not found.</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: 'https://anshumanenterprises.online/logo.webp',
    description: product.description || `Buy ${product.name} at premium pricing.`,
    sku: product.sku || product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.sale_price || product.base_price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.type === 'physical' && inventoryCount !== null && inventoryCount <= 0 
        ? 'https://schema.org/OutOfStock' 
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: brand_slug === 'futurewithai' ? 'FutureWithAi' : 'Anshuman Enterprises'
      }
    }
  };

  return (
    <div className="glass-card bg-white max-w-4xl mx-auto p-6 md:p-10 animate-fade-in space-y-8 border rounded-2xl shadow-md text-gray-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Placeholder Product Gallery Visual */}
        <div className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-[var(--border-color)] p-6">
          <span className="text-3xl mb-2">{product.type === 'physical' ? '⚙️' : '📦'}</span>
          <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Product Visual Mockup</span>
        </div>

        {/* Product Meta */}
        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--primary-color)] bg-[var(--primary-light)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
              {product.type}
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-2">{product.name}</h2>
            
            {product.sku && (
              <p className="text-[10px] text-[var(--text-muted)] font-mono">SKU Model: {product.sku}</p>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-mono font-black text-[var(--text-primary)]">
                ₹{(product.sale_price || product.base_price).toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-xs text-[var(--text-muted)] line-through">
                  ₹{product.base_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Inventory Alerts for physical products */}
            {product.type === 'physical' && (
              <div className="text-xs font-semibold">
                {inventoryCount !== null && inventoryCount > 0 ? (
                  <span className="text-green-650">In Stock ({inventoryCount} units remaining)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button
              fullWidth
              disabled={product.type === 'physical' && inventoryCount !== null && inventoryCount <= 0}
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.sale_price || product.base_price,
                  type: product.type,
                  brandSlug: brand_slug,
                })
              }
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Description and Metadata details */}
      <div className="border-t pt-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Product Specifications</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description || 'No detailed description available.'}
          </p>
        </div>

        {product.metadata && Object.keys(product.metadata).length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Attributes & Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-xl p-4 bg-gray-50 border-gray-150">
              {Object.entries(product.metadata).map(([key, val]) => (
                <div key={key} className="text-xs flex justify-between border-b pb-1.5 last:border-b-0 border-gray-100">
                  <span className="font-bold text-gray-500 capitalize">{key}: </span>
                  <span className="text-gray-800 font-semibold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
