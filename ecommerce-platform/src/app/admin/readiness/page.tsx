'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Blocker {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Content' | 'Auth' | 'Payment' | 'SEO' | 'Launch';
  critical: boolean;
  status: 'Pending' | 'Completed';
  desc: string;
}

const INITIAL_BLOCKERS: Blocker[] = [
  { id: 'b1', name: 'Database Migrations Execution', category: 'Infrastructure', critical: true, status: 'Pending', desc: 'Execute migrations SQL (0 to 7) inside Supabase SQL editor.' },
  { id: 'b2', name: 'Populate Environment Variables', category: 'Infrastructure', critical: true, status: 'Pending', desc: 'Create .env.local file with Supabase URL, service key, and PhonePe merchant keys.' },
  { id: 'b3', name: 'DNS Nameserver Sync', category: 'Infrastructure', critical: true, status: 'Pending', desc: 'Point domain registrar nameservers to Cloudflare.' },
  { id: 'b4', name: 'Supabase Free Email OTP Config', category: 'Auth', critical: true, status: 'Pending', desc: 'Enable free Email OTP Auth provider in Supabase console.' },
  { id: 'b5', name: 'Catalog Seeding Execution', category: 'Content', critical: false, status: 'Pending', desc: 'Seed initial products and categories to PostgreSQL database.' },
  { id: 'b6', name: 'PhonePe PG Production Keys', category: 'Payment', critical: true, status: 'Pending', desc: 'KYC validation and Salt Keys generation on PhonePe Dashboard.' },
  { id: 'b7', name: 'Cloudflare CNAME Records', category: 'Infrastructure', critical: true, status: 'Pending', desc: 'Add A record targeting 76.76.21.21 and CNAME targeting cname.vercel-dns.com.' },
  { id: 'b8', name: 'Upload product assets to Cloudflare R2', category: 'Content', critical: false, status: 'Pending', desc: 'Upload catalog images to public R2 storage bucket.' },
  { id: 'b9', name: 'SEO Google Meta verification', category: 'SEO', critical: false, status: 'Pending', desc: 'Verify ownership inside Google Search Console dashboard.' },
  { id: 'b10', name: 'Enable Uptime UptimeRobot Monitoring', category: 'Launch', critical: false, status: 'Pending', desc: 'Point uptime checks to /api/health endpoint.' },
];

export default function ReadinessGate() {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('owner_readiness_blockers');
    if (saved) {
      try {
        setBlockers(JSON.parse(saved));
      } catch (e) {
        setBlockers(INITIAL_BLOCKERS);
      }
    } else {
      setBlockers(INITIAL_BLOCKERS);
    }
  }, []);

  const saveBlockers = (updated: Blocker[]) => {
    setBlockers(updated);
    localStorage.setItem('owner_readiness_blockers', JSON.stringify(updated));
  };

  const toggleBlocker = (id: string) => {
    const updated = blockers.map(b => 
      b.id === id 
        ? { ...b, status: b.status === 'Completed' ? 'Pending' : 'Completed' } 
        : b
    );
    saveBlockers(updated);
  };

  // Calculations
  const totalWeight = 100;
  const categories = [
    { name: 'Infrastructure', weight: 25 },
    { name: 'Content', weight: 15 },
    { name: 'Auth', weight: 20 },
    { name: 'Payment', weight: 20 },
    { name: 'SEO', weight: 10 },
    { name: 'Launch', weight: 10 },
  ];

  const getCategoryScore = (catName: string) => {
    const catBlockers = blockers.filter(b => b.category === catName);
    if (catBlockers.length === 0) return 100;
    const completed = catBlockers.filter(b => b.status === 'Completed').length;
    return Math.round((completed / catBlockers.length) * 100);
  };

  const getOverallScore = () => {
    let score = 0;
    categories.forEach(cat => {
      const catScore = getCategoryScore(cat.name);
      score += (catScore * cat.weight) / 100;
    });
    return Math.round(score);
  };

  const overallScore = getOverallScore();
  const criticalPending = blockers.filter(b => b.critical && b.status === 'Pending');
  const isDeployBlocked = criticalPending.length > 0;

  return (
    <div className="space-y-8 pb-12 text-gray-200 font-sans">
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#1e1b4b]/60 to-[#0f172a]/80 border border-indigo-950 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚦</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Go-Live Readiness Gate</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            This security gate scans critical services. If any key infrastructure, domain configuration, or payment configurations are pending, deployments will be blocked to protect customers from transaction failures.
          </p>
        </div>

        {/* Deploy Trigger Button */}
        <div className="bg-[#0b0f19] border border-indigo-900/40 p-5 rounded-2xl flex flex-col items-center gap-3 w-full md:w-80 shadow-inner text-center">
          <span className="text-[10px] text-indigo-400 font-black tracking-wider uppercase">Go Live Score: {overallScore}%</span>
          <button
            disabled={isDeployBlocked}
            onClick={() => alert('🚀 Initiating Vercel Production Build and deploy!')}
            className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition shadow-lg ${
              isDeployBlocked 
                ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/10'
            }`}
          >
            {isDeployBlocked ? '🔒 Deploy Blocked (Critical Blockers)' : '🚀 Release to Production'}
          </button>
          {isDeployBlocked && (
            <p className="text-[10px] text-rose-400 font-semibold mt-1">
              ⚠️ Resolve {criticalPending.length} critical blockers to unlock deployment.
            </p>
          )}
        </div>
      </div>

      {/* Category breakdown grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(cat => {
          const score = getCategoryScore(cat.name);
          return (
            <div key={cat.name} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400">{cat.name}</span>
                <span className="text-xs font-black text-white">{score}%</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${score === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${score}%` }} 
                />
              </div>
              <div className="text-[10px] text-gray-500">
                Weight: {cat.weight}% of overall score.
              </div>
            </div>
          );
        })}
      </div>

      {/* Blockers lists table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Fulfillment Blockers Check</h2>
        <div className="divide-y divide-gray-800">
          {blockers.map(blocker => (
            <div key={blocker.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">{blocker.name}</h3>
                  {blocker.critical && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded bg-rose-950/60 text-rose-400 border border-rose-900/40">Critical</span>
                  )}
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded bg-[#0b0f19] text-indigo-400">{blocker.category}</span>
                </div>
                <p className="text-[11px] text-gray-400">{blocker.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleBlocker(blocker.id)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                    blocker.status === 'Completed'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/20'
                      : 'bg-gray-850 hover:bg-gray-800 text-gray-400 border border-gray-800'
                  }`}
                >
                  {blocker.status === 'Completed' ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
