'use client';

import React, { useState } from 'react';

export default function AutomationSandbox() {
  const [webhookLog, setWebhookLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const triggerMockWebhook = () => {
    setLoading(true);
    setTimeout(() => {
      const log = `[MOCK WEBHOOK CALLBACK] Order ID: AE-${Math.floor(1000 + Math.random() * 9000)} | Status: PAID | Email Sent: MOCK_SUCCESS`;
      setWebhookLog([log, ...webhookLog]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans p-8 md:p-12 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Experimental / Workspace</span>
          <h1 className="text-2xl font-extrabold text-white">⚡ Automation Webhook Simulator (Mock-Only)</h1>
          <p className="text-xs text-gray-400">Simulate order sync webhooks and database cron queue loops without writing real database parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Actions</h2>
            <button
              onClick={triggerMockWebhook}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
            >
              {loading ? 'Simulating...' : '⚡ Trigger Mock Payment Webhook'}
            </button>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Log Outputs</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {webhookLog.length > 0 ? (
                webhookLog.map((log, idx) => (
                  <div key={idx} className="p-3 bg-[#0b0f19] border border-gray-800 rounded-xl font-mono text-[10px] text-indigo-400 leading-normal">
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No webhook activities triggered yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
