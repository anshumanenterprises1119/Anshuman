'use client';

import React, { useState } from 'react';

export default function ContentPlayground() {
  const [headline, setHeadline] = useState('Premium wholesale electrical components distributor');
  const [previewHeadline, setPreviewHeadline] = useState(headline);

  const handleApplyMock = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewHeadline(headline);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans p-8 md:p-12 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Experimental / Workspace</span>
          <h1 className="text-2xl font-extrabold text-white">📝 Homepage Content Playground</h1>
          <p className="text-xs text-gray-400">Draft and preview storefront banner layouts dynamically. CMS database writes are blocked.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Draft Headline</h2>
            <form onSubmit={handleApplyMock} className="space-y-4">
              <textarea 
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none min-h-[80px]"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                🔬 Render Mock Layout
              </button>
            </form>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Homepage Banner Layout</h2>
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-900/40 rounded-xl shadow-inner text-center">
              <h3 className="text-sm font-black text-white leading-relaxed max-w-xs">{previewHeadline}</h3>
            </div>
            <p className="text-[10px] text-gray-500 italic mt-3 text-center">Rendering mock CSS bindings. CMS database tables remain untouched.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
