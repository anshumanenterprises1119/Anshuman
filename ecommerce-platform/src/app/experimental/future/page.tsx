'use client';

import React, { useState } from 'react';

export default function FutureSandbox() {
  const [downloadLogs, setDownloadLogs] = useState<string[]>([]);
  const [token, setToken] = useState('');

  const handleSimulateDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const isMatched = token.toUpperCase().startsWith('FWA-');
    if (isMatched) {
      setDownloadLogs([
        `[DOWNLOAD GRANTED] Auth token verified. Initiating stream for cinematic reels zip package (temp signature: 60s)...`,
        ...downloadLogs
      ]);
    } else {
      setDownloadLogs([
        `[ACCESS DENIED] Token signature "${token}" invalid. Check orders log rows.`,
        ...downloadLogs
      ]);
    }
    setToken('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans p-8 md:p-12 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Experimental / Workspace</span>
          <h1 className="text-2xl font-extrabold text-white">🚀 Digital Assets Vault Sandbox</h1>
          <p className="text-xs text-gray-400">Simulate secure token authorization and download redirections. Storage writes are disabled.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Submit Access Token</h2>
            <form onSubmit={handleSimulateDownload} className="space-y-4">
              <input 
                type="text" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. FWA-A3B9C7EC"
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                📥 Simulate File Stream Request
              </button>
            </form>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Fulfillment Status Logs</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {downloadLogs.length > 0 ? (
                downloadLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-[#0b0f19] border border-gray-800 rounded-xl font-mono text-[10px] text-gray-400 leading-normal">
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No asset downloads requested yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
