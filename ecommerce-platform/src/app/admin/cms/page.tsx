'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';

interface Page {
  id: string;
  brand_id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
}

interface PageSection {
  id: string;
  page_id: string;
  type: 'hero' | 'categories' | 'products' | 'reviews' | 'features' | 'faq' | 'cta' | 'newsletter';
  sort_order: number;
  content: any;
}

interface Revision {
  id: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  sections_data: any;
  created_at: string;
}

export default function AdminCmsPage() {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);

  // New Page Form
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // SEO Form States
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>('draft');

  // Add Section States
  const [addSectionType, setAddSectionType] = useState<'hero' | 'categories' | 'products' | 'reviews' | 'features' | 'faq' | 'cta' | 'newsletter'>('hero');
  
  // Section Editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionContentJson, setSectionContentJson] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage.id);
      loadRevisions(selectedPage.id);
      setSeoTitle(selectedPage.seo_title || '');
      setSeoDescription(selectedPage.seo_description || '');
      setSeoKeywords(selectedPage.seo_keywords?.join(', ') || '');
      setPageStatus(selectedPage.status);
    }
  }, [selectedPage]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
      if (data) setPages(data as Page[]);
    } catch (e) {
      console.error('Error loading pages:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async (pageId: string) => {
    try {
      const { data } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order', { ascending: true });

      if (data) setSections(data as PageSection[]);
    } catch (e) {
      console.error('Error loading sections:', e);
    }
  };

  const loadRevisions = async (pageId: string) => {
    try {
      const { data } = await supabase
        .from('page_revisions')
        .select('id, title, seo_title, seo_description, sections_data, created_at')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (data) setRevisions(data as Revision[]);
    } catch (e) {
      console.error('Error loading revisions:', e);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: brand } = await supabase.from('brands').select('id').eq('slug', 'anshuman-enterprises').single();
      if (!brand) return;

      const { data, error } = await supabase
        .from('pages')
        .insert({
          brand_id: brand.id,
          title: newPageTitle,
          slug: newPageSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'draft',
        })
        .select('*')
        .single();

      if (error) throw error;

      setNewPageTitle('');
      setNewPageSlug('');
      loadPages();
      if (data) setSelectedPage(data as Page);
    } catch (err: any) {
      console.error('Error creating page:', err);
      alert(err.message || 'Page slug already exists.');
    }
  };

  const handleUpdatePageMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      const keywordsArray = seoKeywords ? seoKeywords.split(',').map((k) => k.trim()) : null;

      const { error } = await supabase
        .from('pages')
        .update({
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          seo_keywords: keywordsArray,
          status: pageStatus,
        })
        .eq('id', selectedPage.id);

      if (error) throw error;
      
      // Save snapshot inside page_revisions table
      if (user) {
        await supabase.from('page_revisions').insert({
          page_id: selectedPage.id,
          title: selectedPage.title,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          sections_data: sections,
          created_by: user.id,
        });
      }

      alert('SEO metadata saved and revision snapshot created successfully.');
      loadPages();
      loadRevisions(selectedPage.id);
    } catch (err: any) {
      console.error('Error saving meta updates:', err);
      alert(err.message || 'Failed to update page metadata.');
    }
  };

  const handleAddSection = async () => {
    if (!selectedPage) return;

    try {
      const newOrder = sections.length > 0 ? sections[sections.length - 1].sort_order + 1 : 0;
      const defaultContent = 
        addSectionType === 'hero' ? { title: 'Default Hero Title', subtitle: 'Subtitle text banner', cta_text: 'Buy Now', cta_link: '/store' } :
        addSectionType === 'faq' ? { qnas: [{ q: 'Question?', a: 'Answer.' }] } : {};

      const { error } = await supabase.from('page_sections').insert({
        page_id: selectedPage.id,
        type: addSectionType,
        sort_order: newOrder,
        content: defaultContent,
      });

      if (error) throw error;
      loadPageContent(selectedPage.id);
    } catch (err: any) {
      console.error('Error adding section:', err);
    }
  };

  const handleRemoveSection = async (sectionId: string) => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase.from('page_sections').delete().eq('id', sectionId);
      if (error) throw error;
      loadPageContent(selectedPage.id);
    } catch (err: any) {
      console.error('Error removing section:', err);
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    if (!selectedPage) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const list = [...sections];
    const current = list[index];
    const other = list[targetIndex];

    try {
      // Swap database sort orders
      await supabase.from('page_sections').update({ sort_order: other.sort_order }).eq('id', current.id);
      await supabase.from('page_sections').update({ sort_order: current.sort_order }).eq('id', other.id);

      loadPageContent(selectedPage.id);
    } catch (err) {
      console.error('Error shifting section sort orders:', err);
    }
  };

  const handleSelectSectionForEdit = (sec: PageSection) => {
    setEditingSectionId(sec.id);
    setSectionContentJson(JSON.stringify(sec.content, null, 2));
  };

  const handleSaveSectionContent = async () => {
    if (!selectedPage || !editingSectionId) return;

    try {
      const parsed = JSON.parse(sectionContentJson);
      const { error } = await supabase
        .from('page_sections')
        .update({ content: parsed })
        .eq('id', editingSectionId);

      if (error) throw error;
      setEditingSectionId(null);
      loadPageContent(selectedPage.id);
    } catch (err: any) {
      alert(err.message || 'Invalid JSON syntax.');
    }
  };

  const handleRestoreRevision = async (rev: Revision) => {
    if (!selectedPage) return;
    const confirmRestore = confirm('Restore page layout to this version snapshot? All current sections will be replaced.');
    if (!confirmRestore) return;

    try {
      // 1. Delete existing sections
      await supabase.from('page_sections').delete().eq('page_id', selectedPage.id);

      // 2. Restore revision sections
      const restoreList = rev.sections_data as PageSection[];
      for (const sec of restoreList) {
        await supabase.from('page_sections').insert({
          page_id: selectedPage.id,
          type: sec.type,
          sort_order: sec.sort_order,
          content: sec.content,
        });
      }

      // 3. Restore SEO info
      await supabase.from('pages').update({
        seo_title: rev.seo_title,
        seo_description: rev.seo_description,
      }).eq('id', selectedPage.id);

      loadPageContent(selectedPage.id);
      alert('Page revision layout restored successfully.');
    } catch (err: any) {
      console.error('Error restoring layout revision:', err);
    }
  };

  return (
    <div className="space-y-8 text-gray-800">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          CMS Page Builder
        </h1>
        <p className="text-sm text-gray-400 mt-1">Design customizable page routes, re-arrange layout sections, and inspect revision history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Pages List */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-[#1f2937] p-5 rounded-2xl text-white">
            <h2 className="text-sm font-bold border-b border-gray-800 pb-3 mb-4">Website Pages</h2>
            {loading ? (
              <div className="text-xs text-gray-500">Syncing pages...</div>
            ) : (
              <div className="space-y-2 text-xs">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition ${
                      selectedPage?.id === p.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {p.title} <span className="text-[9px] uppercase font-mono block text-indigo-300">/{p.slug} ({p.status})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleCreatePage} className="bg-[#111827] border border-[#1f2937] p-5 rounded-2xl text-white space-y-4">
            <h2 className="text-sm font-bold">Add Custom Page</h2>
            <Input label="Page Title" value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} required className="bg-gray-800 border-gray-700 text-white text-xs" />
            <Input label="Route URL Slug" value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} placeholder="contact-us" required className="bg-gray-800 border-gray-700 text-white text-xs" />
            <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-500 text-xs py-2 rounded-lg font-bold">Register Page</Button>
          </form>
        </div>

        {/* Right workspace panels */}
        <div className="md:col-span-3 space-y-8">
          {selectedPage ? (
            <>
              {/* SEO and Published Status Edit Form */}
              <form onSubmit={handleUpdatePageMeta} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl text-white space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-gray-300">SEO Settings: /{selectedPage.slug}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="SEO Title Tag" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="bg-gray-800 border-gray-700 text-white text-xs" />
                  <Input label="SEO Description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="bg-gray-800 border-gray-700 text-white text-xs" />
                </div>

                <Input label="SEO Keywords (comma separated)" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="part, builder, logistics" className="bg-gray-800 border-gray-700 text-white text-xs" />

                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Publication Status</label>
                    <select
                      value={pageStatus}
                      onChange={(e) => setPageStatus(e.target.value as any)}
                      className="w-40 px-3.5 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white text-xs outline-none"
                    >
                      <option value="draft">Draft mode</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-xs py-2.5 px-6 rounded-lg font-bold shadow-md shadow-indigo-500/10">Save Settings & Revision</Button>
                </div>
              </form>

              {/* Sections list builder */}
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Visual Layout Sections</h3>
                  
                  <div className="flex gap-2">
                    <select
                      value={addSectionType}
                      onChange={(e) => setAddSectionType(e.target.value as any)}
                      className="px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="hero">Hero Banner</option>
                      <option value="categories">Categories Grid</option>
                      <option value="products">Featured Products</option>
                      <option value="reviews">Feedback Grid</option>
                      <option value="features">Highlights Section</option>
                      <option value="faq">FAQ Accordeon</option>
                      <option value="cta">Call to Action Block</option>
                      <option value="newsletter">Newsletter Form</option>
                    </select>
                    <Button onClick={handleAddSection} className="text-xs py-1 px-3 rounded-lg text-white font-bold">Add Section</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sections.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No layout sections added yet. Construct your homepage now.</p>
                  ) : (
                    sections.map((sec, i) => (
                      <div key={sec.id} className="border border-gray-150 rounded-xl p-4 flex justify-between items-center bg-gray-50/50 hover:bg-white transition duration-150 text-xs shadow-sm">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800 capitalize">{sec.type} Section</p>
                          <p className="text-[10px] text-gray-400 font-mono">Order Index: {sec.sort_order}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleMoveSection(i, 'up')}
                              disabled={i === 0}
                              className="px-2 py-1 bg-white border rounded text-[10px] disabled:opacity-30 hover:bg-gray-100 transition font-bold"
                            >
                              ▲ Up
                            </button>
                            <button
                              onClick={() => handleMoveSection(i, 'down')}
                              disabled={i === sections.length - 1}
                              className="px-2 py-1 bg-white border rounded text-[10px] disabled:opacity-30 hover:bg-gray-100 transition font-bold"
                            >
                              ▼ Down
                            </button>
                          </div>

                          <button
                            onClick={() => handleSelectSectionForEdit(sec)}
                            className="px-3 py-1 border border-indigo-150 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 transition rounded-lg font-bold text-[10px]"
                          >
                            Edit JSON Content
                          </button>

                          <button
                            onClick={() => handleRemoveSection(sec.id)}
                            className="text-red-500 hover:underline font-bold text-[10px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Inline Section Content JSON Editor */}
              {editingSectionId && (
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-gray-800">Edit Section Content</h3>
                  <textarea
                    value={sectionContentJson}
                    onChange={(e) => setSectionContentJson(e.target.value)}
                    rows={6}
                    className="w-full p-3 font-mono text-[10px] text-gray-700 border rounded-xl outline-none focus:border-indigo-500 bg-gray-50"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSectionContent} className="text-xs py-1.5 px-4 rounded-lg text-white font-bold">Save JSON Content</Button>
                    <Button onClick={() => setEditingSectionId(null)} variant="secondary" className="text-xs py-1.5 px-4 rounded-lg text-gray-500">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Version Revisions History */}
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-800">Version Revisions History</h3>
                {revisions.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No revision snapshots recorded yet.</p>
                ) : (
                  <div className="divide-y divide-gray-50 text-xs">
                    {revisions.map((rev) => (
                      <div key={rev.id} className="py-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-800">Revision Snapshot ({new Date(rev.created_at).toLocaleString()})</p>
                          <p className="text-[10px] text-gray-450">Title tag: {rev.seo_title || 'None'}</p>
                        </div>
                        <button
                          onClick={() => handleRestoreRevision(rev)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition rounded-lg font-bold text-[10px] border border-indigo-100"
                        >
                          Restore Rollback
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#111827]/5 border border-[#1f2937]/10 border-dashed p-12 rounded-2xl text-center text-gray-500 text-xs leading-relaxed max-w-md mx-auto">
              Select or register a page path in the sidebar registry to begin visual layouts customization.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
