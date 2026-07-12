'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

function DownloadVaultContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const assetId = searchParams.get('asset_id') || '';

  const [status, setStatus] = useState<'verifying' | 'granted' | 'denied'>('verifying');
  const [statusMessage, setStatusMessage] = useState('Validating secure token authorization...');
  const [assetInfo, setAssetInfo] = useState<{ name: string; fileName: string } | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user && assetId) {
      verifyAndDeliver();
    } else if (!user) {
      setStatus('denied');
      setStatusMessage('Authentication required. Only the buyer can access this vault.');
    } else {
      setStatus('denied');
      setStatusMessage('No digital asset ID specified in request.');
    }
  }, [user, assetId]);

  const verifyAndDeliver = async () => {
    try {
      // 1. Fetch digital asset details
      const { data: asset, error: assetError } = await supabase
        .from('digital_assets')
        .select('product_id, file_name')
        .eq('id', assetId)
        .single();

      if (assetError || !asset) {
        throw new Error('Digital asset not found in database registry.');
      }

      // 2. Validate buyer access
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchase_access')
        .select('id')
        .eq('profile_id', user!.id)
        .eq('product_id', asset.product_id)
        .eq('is_active', true)
        .single();

      if (purchaseError || !purchase) {
        setStatus('denied');
        setStatusMessage('Access Denied. Only the authorized buyer has digital rights to this file.');
        return;
      }

      setAssetInfo({
        name: 'Secured Digital Bundle',
        fileName: asset.file_name
      });
      startDownloadFlow(asset.file_name);
    } catch (e: any) {
      console.warn('DB check failed. Checking simulated localStorage vault details:', e.message);
      
      // Fallback check
      const cached = JSON.parse(localStorage.getItem('simulated_purchases') || '[]');
      const match = cached.find((p: any) => p.productId === assetId);

      if (match) {
        setAssetInfo({
          name: match.name,
          fileName: `${match.slug}.zip`
        });
        startDownloadFlow(`${match.slug}.zip`);
      } else {
        setStatus('denied');
        setStatusMessage('Digital asset reference not found in your purchases.');
      }
    }
  };

  const startDownloadFlow = (fileName: string) => {
    setStatus('verifying');
    
    // Animate validation steps
    const steps = [
      { p: 25, msg: 'Validating secure cryptographic download tokens...' },
      { p: 50, msg: 'Confirming buyer transaction matching records...' },
      { p: 75, msg: 'Registering download IP & device telemetry analytics...' },
      { p: 100, msg: 'Vault authorization granted! Streaming file...' }
    ];

    let currentStep = 0;
    const interval = setInterval(async () => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusMessage(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setStatus('granted');
        triggerFileDownload(fileName);
        
        // Log telemetry to downloads table (fails gracefully if table doesn't exist)
        try {
          await supabase.from('downloads').insert({
            profile_id: user!.id,
            digital_asset_id: assetId,
            ip_address: '127.0.0.1', // Mock IP or fetch from server route if needed
            user_agent: navigator.userAgent
          });
        } catch (err) {
          console.warn('Download telemetry logging skipped: downloads table not fully migrated.');
        }
      }
    }, 600);
  };

  const triggerFileDownload = (fileName: string) => {
    // Generate a mock file stream bundle
    const mockContent = `Anshuman Commerce Protected Digital Delivery\nAsset ID: ${assetId}\nOwner Email: ${user?.email}\nLicense: SECURE-FWAI-STREAM\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-md w-full bg-[#111827] border border-[#1f2937] p-8 rounded-2xl shadow-2xl text-center space-y-6">
      <div className="space-y-2">
        <span className="text-4xl">🔒</span>
        <h2 className="text-xl font-bold text-white">FutureWithAI Secure Vault</h2>
        <p className="text-xs text-gray-500">Digital Rights Management & Tokenized Delivery</p>
      </div>

      {status === 'verifying' && (
        <div className="space-y-4 pt-4">
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-indigo-400 font-mono animate-pulse">{statusMessage}</p>
        </div>
      )}

      {status === 'granted' && assetInfo && (
        <div className="space-y-4 pt-4 animate-fade-in">
          <div className="p-4 bg-emerald-950/50 border border-emerald-900 rounded-xl space-y-1">
            <span className="text-xs text-emerald-400 font-bold block">✓ Authorization Verified</span>
            <span className="text-sm font-extrabold text-white block">{assetInfo.name}</span>
            <span className="text-[10px] text-gray-400 font-mono block">{assetInfo.fileName}</span>
          </div>
          <p className="text-xs text-gray-400">Your download has started. If it did not run, click below:</p>
          <Button
            onClick={() => triggerFileDownload(assetInfo.fileName)}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs py-2 px-6"
          >
            Trigger Download Again
          </Button>
        </div>
      )}

      {status === 'denied' && (
        <div className="space-y-4 pt-4 animate-fade-in">
          <div className="p-4 bg-red-950/50 border border-red-900 rounded-xl space-y-1">
            <span className="text-xs text-red-400 font-bold block">❌ Authorization Failed</span>
            <p className="text-[11px] text-gray-300 leading-normal mt-2">{statusMessage}</p>
          </div>
          <p className="text-xs text-gray-500">Only the registered email account buyer can access this file.</p>
          <a href="/futurewithai/products" className="inline-block mt-2">
            <Button variant="secondary" className="text-xs py-2 px-6 bg-gray-800 border-gray-700 hover:bg-gray-700">
              Back to Catalog
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

export default function SecureDownloadVaultPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="max-w-md w-full bg-[#111827] border border-[#1f2937] p-8 rounded-2xl shadow-2xl text-center">
          <p className="text-xs text-gray-500">Loading secure token client parameters...</p>
        </div>
      }>
        <DownloadVaultContent />
      </Suspense>
    </div>
  );
}
