import React from 'react';
import { notFound } from 'next/navigation';

interface BrandConfig {
  name: string;
  themeColor: string;
  fontFamily: string;
}

const BRAND_CONFIGS: Record<string, BrandConfig> = {
  'anshuman-enterprises': {
    name: 'Anshuman Enterprises',
    themeColor: '#0066cc', // Professional Blue
    fontFamily: 'sans-serif',
  },
  'futurewithai': {
    name: 'FutureWithAi',
    themeColor: '#8a2be2', // Modern violet/purple
    fontFamily: 'monospace',
  },
};

export async function generateMetadata({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  
  if (brandSlug === 'futurewithai') {
    return {
      title: 'FutureWithAI | n8n AI Automation & Digital Products Store',
      description: 'India\'s premier digital products store. Instantly download ready-to-deploy n8n AI agent workflows, pre-tested PHP micro-services, NodeJS SaaS boilerplates, prompt engineering blueprints, and viral video editing assets.',
      keywords: ['n8n workflows', 'AI automations', 'PHP scripts bundle', 'SaaS boilerplate', 'Prompt engineering blueprints', 'digital product downloads'],
      verification: {
        google: 'google-site-verification-placeholder-code',
      }
    };
  } else {
    return {
      title: 'Anshuman Enterprises | Wholesale Electrical Supplier in Greater Noida',
      description: 'Anshuman Enterprises is Greater Noida\'s trusted wholesale electrical distributor and contracting partner. Supplying 100% genuine Polycab wires, Havells MCBs, Crabtree switches, Orient LED lighting, and CP Plus CCTV grids.',
      keywords: ['Electrical Supplier Greater Noida', 'Wholesale Electricals', 'Polycab Wire Greater Noida', 'Havells Switch', 'Crabtree Modular Switch', 'CCTV installation Greater Noida', 'Conduit Pipes'],
      verification: {
        google: 'google-site-verification-placeholder-code',
      }
    };
  }
}

export default function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { brand_slug: string };
}) {
  const brand = BRAND_CONFIGS[params.brand_slug];
  if (!brand) {
    notFound();
  }

  return (
    <div style={{ borderColor: brand.themeColor }} className="brand-wrapper min-h-screen flex flex-col">
      {/* Brand Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-xl font-bold" style={{ color: brand.themeColor }}>
          {brand.name}
        </h1>
        <nav className="flex gap-4">
          <a href={`/${params.brand_slug}`} className="hover:underline text-sm font-medium">Home</a>
          <a href={`/${params.brand_slug}/catalog`} className="hover:underline text-sm font-medium">Shop</a>
          <a href={`/${params.brand_slug}/cart`} className="hover:underline text-sm font-medium">Cart</a>
          <a href={`/${params.brand_slug}/dashboard`} className="hover:underline text-sm font-medium">Account</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Brand Footer */}
      <footer className="border-t py-8 text-center text-xs text-gray-500 bg-gray-50 mt-auto space-y-3">
        <div className="flex justify-center gap-6">
          <a href={`/${params.brand_slug}/privacy`} className="hover:underline hover:text-gray-800">Privacy Policy</a>
          <a href={`/${params.brand_slug}/terms`} className="hover:underline hover:text-gray-800">Terms of Use</a>
          <a href={`/${params.brand_slug}/return-policy`} className="hover:underline hover:text-gray-800">Return & Shipping Policy</a>
        </div>
        <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
