'use client';

import React from 'react';
import { Button } from '../../components/ui/Button';

export default function FutureWithAILandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 py-12 px-6 flex flex-col items-center justify-center space-y-12">
      {/* Hero Header */}
      <div className="max-w-4xl text-center space-y-6">
        <span className="px-3.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
          ⚡ FutureWithAI Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Supercharge Your Business with{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            AI Automations
          </span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Unlock premium n8n automation workflows, pre-tested PHP micro-apps, code templates, and ultimate web application themes. Protected vault delivery.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <a href="/futurewithai/products">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg">
              Explore Templates
            </Button>
          </a>
          <a href="/futurewithai/library">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 text-sm px-8 py-3 rounded-xl">
              Access My Library
            </Button>
          </a>
        </div>
      </div>

      {/* Feature Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full pt-8">
        <div className="bg-[#111827]/60 border border-[#1f2937] p-6 rounded-2xl space-y-3">
          <span className="text-3xl">🤖</span>
          <h3 className="text-base font-bold text-white">n8n AI Packs</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Ready-to-deploy LLM agent loops, autonomous lead generation pipelines, and multi-agent coordination frameworks.</p>
        </div>

        <div className="bg-[#111827]/60 border border-[#1f2937] p-6 rounded-2xl space-y-3">
          <span className="text-3xl">⚙️</span>
          <h3 className="text-base font-bold text-white">PHP micro-services</h3>
          <p className="text-xs text-gray-400 leading-relaxed">1500+ manually-tested lightweight PHP utility modules, database connector APIs, and custom routing setups.</p>
        </div>

        <div className="bg-[#111827]/60 border border-[#1f2937] p-6 rounded-2xl space-y-3">
          <span className="text-3xl">🔒</span>
          <h3 className="text-base font-bold text-white">Protected Downloads</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Tokenized download link protection with device logs, download limits, and instant license key allocation.</p>
        </div>
      </div>
    </div>
  );
}
