'use client';

import React, { useState } from 'react';

export default function AIResearchSandbox() {
  const [productName, setProductName] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimulateGemini = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;
    setLoading(true);
    setTimeout(() => {
      setGeneratedDesc(`**[MOCK GEMINI RESPONSE for "${productName}"]**\n\nUpgrade your space with the genuine quality of our premium ${productName}. Designed for high performance, efficiency, and durability in residential and commercial electrical assemblies. Fits standard slots perfectly.`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans p-8 md:p-12 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Experimental / Workspace</span>
          <h1 className="text-2xl font-extrabold text-white">🤖 AI Research Sandbox (Mock-Only)</h1>
          <p className="text-xs text-gray-400">Simulate Gemini AI text and SEO descriptions generator. Database writes are completely disabled.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Input Product Name</h2>
            <form onSubmit={handleSimulateGemini} className="space-y-4">
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Polycab wire 2.5mm"
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                {loading ? 'Thinking...' : '🧠 Generate Description'}
              </button>
            </form>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">AI Written Output</h2>
            {generatedDesc ? (
              <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl text-xs text-gray-300 whitespace-pre-line leading-relaxed shadow-inner">
                {generatedDesc}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">Enter product name and submit to preview mock SEO keywords output.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
