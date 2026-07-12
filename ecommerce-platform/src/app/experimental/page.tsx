'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ExperimentalWorkspace() {
  const router = useRouter();

  const workspaces = [
    { id: 'ai', name: '🤖 AI Research Sandbox', desc: 'Experiment with Gemini prompt integrations, product description generators, and layout rewrites.', link: '/experimental/ai' },
    { id: 'automation', name: '⚡ Automation Integrations', desc: 'Try webhook triggers, Google Sheet sync workflows, and free confirmation notifications.', link: '/experimental/automation' },
    { id: 'future', name: '🚀 FutureWithAI Storefront', desc: 'Simulate digital checkout pipelines, secure token access, and downloads vaults.', link: '/experimental/future' },
    { id: 'content', name: '📝 Static Content Playground', desc: 'Draft banner headlines, modify schemas, and preview localized homepage structures.', link: '/experimental/content' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans p-8 md:p-12 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Isolated Experimental Workspace</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            This directory functions as an isolated sandbox environment. Try new technologies, run calculations, and download files. **DB writes, email triggers, and production updates are strictly blocked.**
          </p>
        </div>

        {/* Workspaces list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map(ws => (
            <div 
              key={ws.id} 
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-indigo-950 transition duration-150 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h2 className="text-sm font-extrabold text-white">{ws.name}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">{ws.desc}</p>
              </div>
              <button
                onClick={() => router.push(ws.link)}
                className="mt-4 w-full py-2.5 bg-[#0b0f19] hover:bg-gray-850 text-indigo-400 hover:text-indigo-300 border border-gray-800 rounded-xl text-xs font-bold transition text-center"
              >
                Enter Sandbox
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-amber-950/10 border border-amber-900/30 rounded-2xl p-6 flex gap-4 text-xs text-amber-200/70">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="leading-relaxed">
            **Safe Build Mode Enforced**: Rest assured that any action taken inside the `/experimental/*` sub-routes is fully mock-based. Your live production databases, customer profiles, and API connections remain completely protected.
          </p>
        </div>

      </div>
    </div>
  );
}
