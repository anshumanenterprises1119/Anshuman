'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { Button } from '../../../components/ui/Button';

interface Tier {
  name: string;
  qty: string;
  price: number;
  originalPrice: number;
  badge?: string;
  sku: string;
}

const TIERS: Tier[] = [
  { name: 'Starter Workflows', qty: '100+ Workflows', price: 19, originalPrice: 999, sku: 'n8n-starter' },
  { name: 'Pro Workflows', qty: '500+ Workflows', price: 49, originalPrice: 1999, badge: 'Popular', sku: 'n8n-pro' },
  { name: 'Developer Pack', qty: '2000+ Workflows', price: 99, originalPrice: 5999, badge: 'Best Seller', sku: 'n8n-dev' },
];

const REPO_CATEGORIES = ['All', 'AI Agents', 'Marketing', 'Data & Scrapers', 'Email & Sync'];

interface RepoFolder {
  name: string;
  category: string;
  workflowsCount: number;
  desc: string;
}

const REPO_FOLDERS: RepoFolder[] = [
  { name: 'OpenAI Agent Pipelines', category: 'AI Agents', workflowsCount: 14, desc: 'RAG vectors, auto blogs generator, and lead qualifier flows.' },
  { name: 'Gemini Chat Triggers', category: 'AI Agents', workflowsCount: 8, desc: 'Image analysis pipelines and direct feedback loops.' },
  { name: 'Email Sequencing Routers', category: 'Marketing', workflowsCount: 12, desc: 'ActiveCampaign and HubSpot email sequencers.' },
  { name: 'Lead Enrichment Scrapers', category: 'Marketing', workflowsCount: 22, desc: 'LinkedIn contact extractors and Google Maps scrapers.' },
  { name: 'Shopify Inventory Monitor', category: 'Data & Scrapers', workflowsCount: 16, desc: 'Auto stock sync and low inventory alert hooks.' },
  { name: 'Database Sync Pipelines', category: 'Email & Sync', workflowsCount: 18, desc: 'Sync Postgres orders with Google Sheets automatically.' },
];

const AUDIENCE_DETAILS: Record<string, string> = {
  agencies: 'Scale your client delivery. Package these workflows, skin them with custom credentials, and sell them as recurring high-ticket automation retainers.',
  freelancers: 'Deliver projects 10x faster. Copy-paste pre-built node structures instead of writing custom JS scripting nodes from scratch.',
  owners: 'Automate lead captures, CRM entries, and daily sales alerts without hiring expensive tech resources.',
  creators: 'Autopost across channels, aggregate comments sentiment, and set up automated newsletter routers easily.',
};

export default function N8nPackPage() {
  const { addToCart } = useCart();
  const [selectedTierIndex, setSelectedTierIndex] = useState(2); // Default to Developer Pack
  const [activeRepoCategory, setActiveRepoCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudienceTab, setActiveAudienceTab] = useState('agencies');
  const [countdownText, setCountdownText] = useState('23:59:59');

  useEffect(() => {
    // Enable FutureWithAi brand theme
    document.documentElement.setAttribute('data-brand', 'futurewithai');
    
    // Setup a simple ticking countdown timer for urgency blocks
    const timer = setInterval(() => {
      const date = new Date();
      const hours = 23 - date.getHours();
      const minutes = 59 - date.getMinutes();
      const seconds = 59 - date.getSeconds();
      setCountdownText(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectedTier = TIERS[selectedTierIndex];

  const filteredFolders = REPO_FOLDERS.filter((folder) => {
    const matchesCategory = activeRepoCategory === 'All' || folder.category === activeRepoCategory;
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      folder.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = () => {
    addToCart({
      id: selectedTier.sku,
      name: `n8n Automation Pack - ${selectedTier.name} (${selectedTier.qty})`,
      price: selectedTier.price,
      type: 'digital',
      brandSlug: 'futurewithai',
    });
  };

  return (
    <div className="space-y-12 animate-fade-in" style={{ backgroundColor: '#0a0614', color: '#fff', margin: '-32px -16px', padding: '32px 16px' }}>
      
      {/* 1. Sticky Urgency Announcement Bar */}
      <div className="text-center py-2.5 px-4 text-xs md:text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-black flex justify-center items-center gap-3 rounded-lg shadow-lg">
        <span>🔥 <strong>LIMITED PRICE LAUNCH OFFER</strong> — Regular Price raises to ₹249 soon!</span>
        <span className="bg-black/25 text-white px-2 py-0.5 rounded font-mono font-bold">⏳ {countdownText}</span>
      </div>

      {/* 2. Hero Header */}
      <section className="text-center space-y-6 max-w-4xl mx-auto py-8">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">⚡ Instant Workspace Accelerator</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Build Less. <span className="text-orange-500">Automate More.</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Get access to a curated collection of ready-to-import n8n workflow templates designed to launch automations at enterprise scale in minutes.
        </p>

        {/* 3. Tier Package Selector */}
        <div className="border border-orange-500/20 bg-black/40 rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            🎛️ Select Asset Volume / पैकेज चुनें:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TIERS.map((tier, idx) => (
              <div
                key={tier.sku}
                onClick={() => setSelectedTierIndex(idx)}
                className={`border rounded-xl p-4 cursor-pointer text-center relative transition flex flex-col justify-between min-h-[110px] ${
                  selectedTierIndex === idx
                    ? 'border-orange-500 bg-orange-500/10 shadow-md'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                {tier.badge && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-black font-bold text-[8px] px-2 py-0.5 rounded-bl uppercase">
                    {tier.badge}
                  </span>
                )}
                <div>
                  <p className="font-extrabold text-sm text-white">{tier.qty}</p>
                  <p className="text-[10px] text-gray-400 leading-snug">{tier.name}</p>
                </div>
                <div className="flex items-baseline justify-center gap-2 mt-4 border-t border-white/5 pt-2">
                  <span className="text-xs text-gray-500 line-through">₹{tier.originalPrice}</span>
                  <span className="text-lg font-black text-orange-400">₹{tier.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-white/5">
            <div className="text-xs text-gray-400">
              <p>Selected: <strong className="text-white">{selectedTier.name}</strong></p>
              <p>Delivery: <strong className="text-green-400">Instant Download</strong></p>
            </div>
            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
              Add Selection To Cart • ₹{selectedTier.price}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Repository Explorer Component */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 max-w-5xl mx-auto shadow-md">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Interactive Explorer</span>
          <h3 className="text-2xl font-extrabold">Private Repository Directory</h3>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            Browse folders inside our developer pack. Search templates or click categories to preview workflow assets.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Repository Tree Navigation */}
          <div className="w-full md:w-64 space-y-4 border-r border-white/10 pr-0 md:pr-6">
            <div className="flex flex-wrap md:flex-col gap-2">
              {REPO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveRepoCategory(cat)}
                  className={`text-left px-3 py-2 rounded-md text-xs font-semibold w-full ${
                    activeRepoCategory === cat
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20'
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  📁 {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search directory..."
              className="form-input text-xs bg-black/40 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Directory Listings */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFolders.map((folder) => (
              <div key={folder.name} className="border border-white/5 bg-[#120c1e] p-5 rounded-xl space-y-2 hover:border-white/10 transition">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-white">{folder.name}</h4>
                  <span className="text-[9px] font-bold bg-white/5 text-orange-400 border border-white/10 px-2 py-0.5 rounded">
                    {folder.workflowsCount} Workflows
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{folder.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Timelines: How It Works */}
      <section className="space-y-8 max-w-4xl mx-auto py-6">
        <h3 className="text-2xl font-bold text-center">Process Pipeline Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-white/5 bg-[#120c1e] p-6 rounded-xl relative space-y-2">
            <span className="text-5xl font-black text-white/5 absolute top-2 right-4">01</span>
            <h4 className="font-bold text-base text-orange-500">Secure Order</h4>
            <p className="text-xs text-gray-400">Complete checkout and pay easily via UPI or Card.</p>
          </div>
          <div className="border border-white/5 bg-[#120c1e] p-6 rounded-xl relative space-y-2">
            <span className="text-5xl font-black text-white/5 absolute top-2 right-4">02</span>
            <h4 className="font-bold text-base text-orange-500">File Download</h4>
            <p className="text-xs text-gray-400">Instantly get access tokens in your dashboard workspace.</p>
          </div>
          <div className="border border-white/5 bg-[#120c1e] p-6 rounded-xl relative space-y-2">
            <span className="text-5xl font-black text-white/5 absolute top-2 right-4">03</span>
            <h4 className="font-bold text-base text-orange-500">JSON Import</h4>
            <p className="text-xs text-gray-400">Import workflow JSON templates directly into your n8n workspace.</p>
          </div>
          <div className="border border-white/5 bg-[#120c1e] p-6 rounded-xl relative space-y-2">
            <span className="text-5xl font-black text-white/5 absolute top-2 right-4">04</span>
            <h4 className="font-bold text-base text-orange-500">Connect APIs</h4>
            <p className="text-xs text-gray-400">Input your OpenAI, HubSpot or WhatsApp credentials and run.</p>
          </div>
        </div>
      </section>

      {/* 6. Target Audience fit segment selector */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto shadow-sm">
        <h3 className="text-xl font-bold text-center text-orange-500">Who Can Automate With This?</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.keys(AUDIENCE_DETAILS).map((aud) => (
            <button
              key={aud}
              onClick={() => setActiveAudienceTab(aud)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition ${
                activeAudienceTab === aud
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
        <div className="bg-[#120c1e] border border-white/5 p-6 rounded-xl text-center">
          <p className="text-sm text-gray-300 leading-relaxed italic">
            &quot;{AUDIENCE_DETAILS[activeAudienceTab]}&quot;
          </p>
        </div>
      </section>

    </div>
  );
}
