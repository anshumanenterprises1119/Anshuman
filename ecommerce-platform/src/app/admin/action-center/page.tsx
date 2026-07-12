'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Step {
  id: string;
  name: string;
  desc: string;
  time: string;
  status: 'Pending' | 'Completed';
  dependency: string;
  link: string;
  actionLabel: string;
}

const INITIAL_STEPS: Step[] = [
  { id: 's1', name: 'Domain Setup', desc: 'Purchase anshumanenterprises.online domain name at registrar.', time: '10 mins', status: 'Pending', dependency: 'None', link: '/admin/onboarding', actionLabel: 'Open Domain Wizard' },
  { id: 's2', name: 'Point DNS Nameservers', desc: 'Configure domains to redirect nameservers to Cloudflare.', time: '10 mins', status: 'Pending', dependency: 'Domain Setup', link: '/admin/onboarding', actionLabel: 'View Nameserver Guide' },
  { id: 's3', name: 'Create Supabase Database', desc: 'Set up your cloud database instance in Supabase dashboard.', time: '10 mins', status: 'Pending', dependency: 'Point DNS Nameservers', link: '/admin/onboarding', actionLabel: 'Open Supabase Wizard' },
  { id: 's4', name: 'Execute Database Migrations', desc: 'Paste the migration SQL scripts 0 to 7 to structure database.', time: '15 mins', status: 'Pending', dependency: 'Create Supabase Database', link: '/admin/onboarding', actionLabel: 'Get Migrations SQL' },
  { id: 's5', name: 'Deploy Express Payment Server', desc: 'Deploy payment-server files to Render or Vercel and connect variables.', time: '20 mins', status: 'Pending', dependency: 'Execute Database Migrations', link: '/admin/onboarding', actionLabel: 'Open Payment Wizard' },
  { id: 's6', name: 'Deploy Google Apps Script Web App', desc: 'Set up Apps Script connected to Google Sheets for email deliveries.', time: '15 mins', status: 'Pending', dependency: 'Execute Database Migrations', link: '/admin/onboarding', actionLabel: 'Get Apps Script Code' },
  { id: 's7', name: 'Configure Free Email OTP Auth', desc: 'Enable free built-in magic-links and OTP logins in Supabase.', time: '10 mins', status: 'Pending', dependency: 'Create Supabase Database', link: '/admin/onboarding', actionLabel: 'Open Email Wizard' },
  { id: 's8', name: 'Input Environment Keys', desc: 'Generate and configure the .env.local file properties.', time: '10 mins', status: 'Pending', dependency: 'Create Supabase Database', link: '/admin/onboarding', actionLabel: 'Open Env Config' },
  { id: 's9', name: 'Seed Wholesale Products Catalog', desc: 'Execute seeding script locally or via onboarding seed tab.', time: '5 mins', status: 'Pending', dependency: 'Execute Database Migrations', link: '/admin/onboarding', actionLabel: 'Run Seeder Script' },
  { id: 's10', name: 'Review Homepage & Schemas', desc: 'Review hardcoded coordinates, schemas, and images in static HTML files.', time: '10 mins', status: 'Pending', dependency: 'Domain Setup', link: '/admin/onboarding', actionLabel: 'Open SEO Wizard' },
];

export default function ActionCenter() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [setupMode, setSetupMode] = useState<boolean>(false);
  const [currentSetupIndex, setCurrentSetupIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('owner_setup_steps');
    if (saved) {
      try {
        setSteps(JSON.parse(saved));
      } catch (e) {
        setSteps(INITIAL_STEPS);
      }
    } else {
      setSteps(INITIAL_STEPS);
    }
  }, []);

  const saveSteps = (updated: Step[]) => {
    setSteps(updated);
    localStorage.setItem('owner_setup_steps', JSON.stringify(updated));
  };

  const completeStep = (id: string) => {
    const updated = steps.map(s => s.id === id ? { ...s, status: 'Completed' as const } : s);
    saveSteps(updated);
    
    if (setupMode) {
      // Find next pending step index
      const nextPendingIndex = updated.findIndex((s, idx) => idx > currentSetupIndex && s.status === 'Pending');
      if (nextPendingIndex !== -1) {
        setCurrentSetupIndex(nextPendingIndex);
      } else {
        setSetupMode(false);
        alert('🎉 Congratulations! You have completed all step-by-step setup guides!');
      }
    }
  };

  const handleStartSetup = () => {
    const firstPendingIndex = steps.findIndex(s => s.status === 'Pending');
    if (firstPendingIndex !== -1) {
      setCurrentSetupIndex(firstPendingIndex);
      setSetupMode(true);
    } else {
      alert('All setup tasks are already completed!');
    }
  };

  // Get only pending steps
  const pendingSteps = steps.filter(s => s.status === 'Pending');

  return (
    <div className="space-y-8 pb-12 text-gray-200 font-sans">
      
      {/* Onboarding Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#1e1b4b]/60 to-[#0f172a]/80 border border-indigo-950 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Owner Setup Action Center</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            Execute manual setups in a clean sequential pipeline. Complete tasks one-by-one to unlock the production release.
          </p>
        </div>

        {/* Start Guided Setup Button */}
        {!setupMode ? (
          <button
            onClick={handleStartSetup}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shrink-0"
          >
            🏁 START SETUP FLOW
          </button>
        ) : (
          <button
            onClick={() => setSetupMode(false)}
            className="px-6 py-3.5 bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-bold transition shrink-0"
          >
            🛑 Stop Guided Flow
          </button>
        )}
      </div>

      {/* GUIDED FLOW STEPPING MODAL */}
      {setupMode && steps[currentSetupIndex] && (
        <div className="bg-[#111827] border-2 border-indigo-600 rounded-2xl p-8 space-y-6 shadow-2xl animate-pulse-slow">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-black tracking-wider uppercase">Active Setup Step</span>
              <h2 className="text-lg font-black text-white">{steps[currentSetupIndex].name}</h2>
            </div>
            <span className="text-xs font-semibold text-gray-500">Time Estimate: {steps[currentSetupIndex].time}</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">{steps[currentSetupIndex].desc}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>⛓️ **Dependency Check**: {steps[currentSetupIndex].dependency}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-3">
            <button
              onClick={() => router.push(steps[currentSetupIndex].link)}
              className="px-5 py-3 bg-[#0b0f19] hover:bg-gray-850 text-indigo-400 hover:text-indigo-300 border border-gray-800 rounded-xl text-xs font-bold transition flex-1 text-center"
            >
              {steps[currentSetupIndex].actionLabel}
            </button>
            <button
              onClick={() => completeStep(steps[currentSetupIndex].id)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex-1"
            >
              Mark Task Completed
            </button>
          </div>
        </div>
      )}

      {/* PENDING ACTIONS GRID */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">
          Pending Steps Queue ({pendingSteps.length} items)
        </h2>
        {pendingSteps.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <span className="text-3xl">🎉</span>
            <p className="text-xs text-gray-400">All configurations are complete! The platform is ready for go-live deployment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {pendingSteps.map(step => (
              <div key={step.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-xs font-bold text-white">{step.name}</h3>
                  <p className="text-[11px] text-gray-400">{step.desc}</p>
                  <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                    <span>⏱️ Est: {step.time}</span>
                    <span>⛓️ Requires: {step.dependency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(step.link)}
                    className="px-4 py-2 bg-gray-850 hover:bg-gray-800 text-indigo-400 border border-gray-800 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                  >
                    Open Setup Wizard
                  </button>
                  <button
                    onClick={() => completeStep(step.id)}
                    className="px-4 py-2 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
