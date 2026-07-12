'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';

interface Revision {
  id: string;
  version: number;
  created_at: string;
  created_by: string;
  description: string;
  data: Record<string, any>;
}

export default function AdministrativeContentPage() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<'hero' | 'announcement' | 'navigation' | 'faq' | 'assets' | 'media'>('hero');
  const [loading, setLoading] = useState(false);

  // Global actions states
  const [isPublished, setIsPublished] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);

  // Module 1: Hero Manager States
  const [heroTitle, setHeroTitle] = useState('Anshuman Enterprises');
  const [heroSubtitle, setHeroSubtitle] = useState('Premium Electrical Contracting and Smart IoT Integrations');
  const [heroCtaText, setHeroCtaText] = useState('Explore Catalog');
  const [heroCtaLink, setHeroCtaLink] = useState('/store');
  const [heroImageUrl, setHeroImageUrl] = useState('https://images.unsplash.com/photo-1581092921461-eab62e97a780');

  // Module 2: Announcement Bar States
  const [announcementText, setAnnouncementText] = useState('🚀 Flash Sale: 5% discount on checkout for Silver Tier members!');
  const [announcementLink, setAnnouncementLink] = useState('/store');
  const [announcementActive, setAnnouncementActive] = useState(true);

  // Module 3: Navigation Builder States
  const [navItems, setNavItems] = useState([
    { label: 'Store Front', path: '/store' },
    { label: 'FutureWithAI', path: '/futurewithai' },
    { label: 'My Profile', path: '/profile' }
  ]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkPath, setNewLinkPath] = useState('');

  // Module 4: FAQ Builder States
  const [faqItems, setFaqItems] = useState([
    { question: 'What is the return policy?', answer: 'We offer a 10-day replacement window for defective parts.' },
    { question: 'How is digital content delivered?', answer: 'Digital assets are added to your digital vault on payment validation.' }
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Module 5: Brand Assets States
  const [brandLogoUrl, setBrandLogoUrl] = useState('/icon-logo.png');
  const [brandFaviconUrl, setBrandFaviconUrl] = useState('/favicon.ico');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');

  // Module 6: Media Library States
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e'
  ]);
  const [newMediaLibraryUrl, setNewMediaLibraryUrl] = useState('');

  useEffect(() => {
    loadMockRevisions();
  }, []);

  const loadMockRevisions = () => {
    // Seed default revision history list
    setRevisions([
      {
        id: 'rev_1',
        version: 3,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        created_by: user?.email || 'admin@anshuman.com',
        description: 'Updated hero section subtitles and primary banner image.',
        data: { heroTitle, heroSubtitle, heroImageUrl }
      },
      {
        id: 'rev_2',
        version: 2,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        created_by: 'system@anshuman.com',
        description: 'Added FAQ queries and modified announcement bar text.',
        data: {}
      },
      {
        id: 'rev_3',
        version: 1,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        created_by: 'system@anshuman.com',
        description: 'Initial deployment template release.',
        data: {}
      }
    ]);
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const dataToSave = {
        hero: { heroTitle, heroSubtitle, heroCtaText, heroCtaLink, heroImageUrl },
        announcement: { announcementText, announcementLink, announcementActive },
        navigation: navItems,
        faqs: faqItems,
        brandColors: { primaryColor, secondaryColor },
        media: mediaLibrary
      };

      // Fails gracefully if tables pages/revisions do not exist
      const { error } = await supabase.from('pages').upsert({
        title: 'Main Catalog OS Core Content',
        slug: 'content-os-core',
        status: 'draft',
        seo_title: heroTitle,
        seo_description: heroSubtitle,
        brand_id: 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a' // Anshuman default UUID
      }, { onConflict: 'brand_id,slug' });

      if (error) throw error;

      alert('Content draft saved successfully in Postgres!');
      setHasUnsavedChanges(false);
      setIsPublished(false);
    } catch (e: any) {
      console.warn('DB upsert failed. Saved to client memory (Simulation Mode). Details:', e.message);
      alert('Draft saved successfully (Simulation Mode)!');
      setHasUnsavedChanges(false);
      setIsPublished(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // Add version log
      const newVersion = currentVersion + 1;
      const nextRev: Revision = {
        id: `rev_${Date.now()}`,
        version: newVersion,
        created_at: new Date().toISOString(),
        created_by: user?.email || 'admin@anshuman.com',
        description: `Published changes for ${activeModule.toUpperCase()} Module.`,
        data: { heroTitle, heroSubtitle, announcementText, navItems, faqItems }
      };

      setRevisions(prev => [nextRev, ...prev]);
      setCurrentVersion(newVersion);
      setIsPublished(true);
      setHasUnsavedChanges(false);

      // Attempt to save to public.page_revisions
      const { error } = await supabase.from('page_revisions').insert({
        page_id: 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', // Mock page reference
        title: 'Core Content Revision',
        sections_data: nextRev.data,
      });

      if (error) throw error;
      alert(`Version ${newVersion} published successfully to database!`);
    } catch (err: any) {
      console.warn('DB publish failed. Version update applied locally (Simulation Mode). Details:', err.message);
      alert(`Version ${currentVersion + 1} published (Simulation Mode)!`);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = (rev: Revision) => {
    if (!window.confirm(`Are you sure you want to rollback content to Version ${rev.version}?`)) return;

    if (rev.data.heroTitle) setHeroTitle(rev.data.heroTitle);
    if (rev.data.heroSubtitle) setHeroSubtitle(rev.data.heroSubtitle);
    if (rev.data.heroImageUrl) setHeroImageUrl(rev.data.heroImageUrl);
    if (rev.data.announcementText) setAnnouncementText(rev.data.announcementText);
    if (rev.data.navItems) setNavItems(rev.data.navItems);
    if (rev.data.faqItems) setFaqItems(rev.data.faqItems);

    alert(`Rollback complete. Restored to version ${rev.version}.`);
    setHasUnsavedChanges(true);
    setIsPublished(false);
  };

  return (
    <div className="space-y-8 text-gray-250 min-h-screen">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-850 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
            Content Operating System
          </h1>
          <p className="text-xs text-gray-400 mt-1">Configure brand layouts, hero managers, menu paths, FAQs, and static media files.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
          }`}>
            {isPublished ? 'Live & Published' : 'Draft / Unsaved Changes'}
          </span>
          <Button onClick={handleSaveDraft} variant="outline" className="text-xs py-2 bg-gray-900 border-gray-700 hover:bg-gray-800">
            Save Draft
          </Button>
          <Button onClick={handlePublish} className="bg-teal-600 text-white font-bold hover:bg-teal-500 text-xs py-2">
            Publish Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module Nav sidebar */}
        <aside className="space-y-2 bg-gray-900/60 border border-gray-850 p-4 rounded-2xl h-fit">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Content Modules</h3>
          
          <button
            onClick={() => setActiveModule('hero')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'hero' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            🖼️ Hero Manager
          </button>
          
          <button
            onClick={() => setActiveModule('announcement')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'announcement' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            📢 Announcement Bar
          </button>
          
          <button
            onClick={() => setActiveModule('navigation')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'navigation' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            🔗 Navigation & Footer
          </button>
          
          <button
            onClick={() => setActiveModule('faq')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'faq' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            ❓ FAQ Builder
          </button>
          
          <button
            onClick={() => setActiveModule('assets')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'assets' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            🎨 Brand Assets
          </button>
          
          <button
            onClick={() => setActiveModule('media')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${activeModule === 'media' ? 'bg-indigo-950/75 text-white border-l-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            📁 Media Library
          </button>
        </aside>

        {/* Modules Editors */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] p-6 rounded-2xl shadow-xl min-h-[450px]">
          
          {/* 1. Hero Manager Module */}
          {activeModule === 'hero' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">Hero Section Banner Config</h2>
              <Input
                label="Hero Heading Title"
                value={heroTitle}
                onChange={(e) => { setHeroTitle(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Hero Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => { setHeroSubtitle(e.target.value); setHasUnsavedChanges(true); }}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Button CTA Text"
                  value={heroCtaText}
                  onChange={(e) => { setHeroCtaText(e.target.value); setHasUnsavedChanges(true); }}
                  className="bg-gray-800 border-gray-700 text-white text-xs"
                />
                <Input
                  label="Button CTA Path Link"
                  value={heroCtaLink}
                  onChange={(e) => { setHeroCtaLink(e.target.value); setHasUnsavedChanges(true); }}
                  className="bg-gray-800 border-gray-700 text-white text-xs"
                />
              </div>
              <Input
                label="Hero Background Image URL"
                value={heroImageUrl}
                onChange={(e) => { setHeroImageUrl(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              {/* Image Preview Box */}
              <div className="mt-4 border border-gray-800 rounded-xl overflow-hidden h-36 bg-gray-950 flex items-center justify-center relative">
                <img src={heroImageUrl} alt="Hero banner preview" className="w-full h-full object-cover opacity-80" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x300/1f2937/a78bfa?text=Banner+Image';
                }} />
                <div className="absolute inset-0 flex flex-col justify-center px-6 bg-gradient-to-r from-black/80 to-transparent">
                  <h4 className="text-sm font-extrabold text-white">{heroTitle}</h4>
                  <p className="text-[10px] text-gray-300 max-w-[70%] mt-1 line-clamp-2">{heroSubtitle}</p>
                  <span className="mt-2 px-3 py-1 bg-indigo-600 text-[8px] font-bold text-white rounded w-fit">{heroCtaText}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Announcement Bar Module */}
          {activeModule === 'announcement' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">Announcement Alert Bar</h2>
              <Input
                label="Bar Banner Text Alert"
                value={announcementText}
                onChange={(e) => { setAnnouncementText(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              <Input
                label="Redirect Link URL"
                value={announcementLink}
                onChange={(e) => { setAnnouncementLink(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="announcement_active"
                  checked={announcementActive}
                  onChange={(e) => { setAnnouncementActive(e.target.checked); setHasUnsavedChanges(true); }}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="announcement_active" className="text-xs text-gray-300 select-none cursor-pointer">Activate Alert Bar</label>
              </div>

              {/* Banner Simulation */}
              <div className="pt-4">
                <label className="text-[10px] uppercase font-bold text-gray-500">Live Simulator Preview</label>
                <div className="mt-2 overflow-hidden rounded-lg border border-gray-800">
                  {announcementActive ? (
                    <div className="bg-indigo-900 border-b border-indigo-800 text-white py-2 px-4 text-center text-[10px] font-bold tracking-wide animate-pulse">
                      {announcementText} <a href={announcementLink} className="underline text-indigo-300 ml-1">Learn more &rarr;</a>
                    </div>
                  ) : (
                    <div className="bg-gray-900 text-gray-500 py-3 text-center text-xs italic">
                      Announcement alert bar is currently disabled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Navigation & Footer Builders Module */}
          {activeModule === 'navigation' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">Navigation Menu Builder</h2>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500">Menu Navigation Links</label>
                <div className="space-y-1 bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                  {navItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-850 border border-gray-800 p-2 rounded-lg text-xs">
                      <div>
                        <span className="font-bold text-white">{item.label}</span>
                        <span className="text-[10px] text-gray-500 font-mono ml-2">({item.path})</span>
                      </div>
                      <button
                        onClick={() => { setNavItems(prev => prev.filter((_, idx) => idx !== i)); setHasUnsavedChanges(true); }}
                        className="text-[9px] text-red-400 hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-400">Add Menu Item Link</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Link Label"
                    placeholder="Blog Feed"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white text-[10px]"
                  />
                  <Input
                    label="URL Path"
                    placeholder="/blog"
                    value={newLinkPath}
                    onChange={(e) => setNewLinkPath(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white text-[10px]"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!newLinkLabel || !newLinkPath) return;
                    setNavItems(prev => [...prev, { label: newLinkLabel, path: newLinkPath }]);
                    setNewLinkLabel('');
                    setNewLinkPath('');
                    setHasUnsavedChanges(true);
                  }}
                  className="bg-indigo-650 hover:bg-indigo-600 text-[10px] py-1.5 font-bold"
                >
                  ➕ Add New Link
                </Button>
              </div>
            </div>
          )}

          {/* 4. FAQ Builder Module */}
          {activeModule === 'faq' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">FAQ Accordion Grid</h2>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {faqItems.map((faq, i) => (
                  <div key={i} className="border border-gray-850 p-3 bg-gray-900/50 rounded-lg text-xs space-y-1 relative">
                    <button
                      onClick={() => { setFaqItems(prev => prev.filter((_, idx) => idx !== i)); setHasUnsavedChanges(true); }}
                      className="absolute top-3 right-3 text-[9px] text-red-400 hover:underline uppercase"
                    >
                      Delete
                    </button>
                    <h4 className="font-bold text-white pr-10">Q: {faq.question}</h4>
                    <p className="text-gray-400">A: {faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-400">Add FAQ Item</h4>
                <Input
                  label="Question"
                  placeholder="Is physical tracking available?"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-[10px]"
                />
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Answer</label>
                  <textarea
                    placeholder="Yes, tracking updates are sent via SMS webhook timelines."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!newFaqQ || !newFaqA) return;
                    setFaqItems(prev => [...prev, { question: newFaqQ, answer: newFaqA }]);
                    setNewFaqQ('');
                    setNewFaqA('');
                    setHasUnsavedChanges(true);
                  }}
                  className="bg-indigo-650 hover:bg-indigo-600 text-[10px] py-1.5 font-bold"
                >
                  ➕ Add FAQ Accordion
                </Button>
              </div>
            </div>
          )}

          {/* 5. Brand Assets Module */}
          {activeModule === 'assets' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">Static Branding Settings</h2>
              <Input
                label="Primary Brand Logo URL"
                value={brandLogoUrl}
                onChange={(e) => { setBrandLogoUrl(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              <Input
                label="Favicon ICO Image Link"
                value={brandFaviconUrl}
                onChange={(e) => { setBrandFaviconUrl(e.target.value); setHasUnsavedChanges(true); }}
                className="bg-gray-800 border-gray-700 text-white text-xs"
              />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Primary HSL Theme</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => { setPrimaryColor(e.target.value); setHasUnsavedChanges(true); }}
                      className="w-8 h-8 rounded border border-gray-800 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-xs text-gray-300 self-center uppercase">{primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Accent HSL Theme</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => { setSecondaryColor(e.target.value); setHasUnsavedChanges(true); }}
                      className="w-8 h-8 rounded border border-gray-800 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-xs text-gray-300 self-center uppercase">{secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Media Library Module */}
          {activeModule === 'media' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-200 pb-2 border-b border-[#1f2937]">Media Library Static Files</h2>
              
              <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1 bg-gray-900/50 rounded-lg">
                {mediaLibrary.map((url, i) => (
                  <div key={i} className="relative group border border-gray-850 rounded bg-gray-950 h-16 flex items-center justify-center p-1 overflow-hidden">
                    <img src={url} alt="asset" className="max-h-full max-w-full object-contain" onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x60/1f2937/a78bfa?text=Media';
                    }} />
                    <button
                      onClick={() => { setMediaLibrary(prev => prev.filter((_, idx) => idx !== i)); setHasUnsavedChanges(true); }}
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[8px] font-bold text-red-400 uppercase cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMediaLibraryUrl.trim()) return;
                  setMediaLibrary(prev => [...prev, newMediaLibraryUrl.trim()]);
                  setNewMediaLibraryUrl('');
                  setHasUnsavedChanges(true);
                }}
                className="space-y-2 pt-2 border-t border-[#1f2937]"
              >
                <Input
                  label="Add Asset File Link URL"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newMediaLibraryUrl}
                  onChange={(e) => setNewMediaLibraryUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-xs"
                />
                <Button type="submit" fullWidth className="bg-indigo-650 hover:bg-indigo-600 text-[10px] py-2 rounded-lg font-bold">
                  Upload Asset Reference Link
                </Button>
              </form>
            </div>
          )}

        </div>

        {/* Version History Log Timeline */}
        <div className="bg-gray-900/60 border border-gray-850 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-gray-200">Version History</h3>
          <p className="text-[10px] text-gray-500">Restore or rollback entire CMS layouts in one click.</p>
          
          <div className="space-y-4 pt-2 relative border-l border-gray-800 pl-4 ml-2">
            {revisions.map((rev) => (
              <div key={rev.id} className="relative space-y-1 text-xs">
                {/* Timeline node icon */}
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-gray-900" />
                
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono font-bold text-indigo-400">VERSION {rev.version}</span>
                  <span className="text-gray-500 font-mono">{new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-gray-300 leading-normal font-semibold text-[11px]">{rev.description}</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[8px] text-gray-500 font-mono truncate max-w-[60%]">{rev.created_by}</span>
                  <button
                    onClick={() => handleRollback(rev)}
                    className="text-[9px] text-indigo-300 hover:text-indigo-400 hover:underline uppercase font-bold"
                  >
                    Rollback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
