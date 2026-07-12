'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useRouter, useSearchParams } from 'next/navigation';

function AdminLoginForm() {
  const { user, profile, signInWithEmail, verifyOtp, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Apply admin dark theme class to root html element for styling scope
    document.documentElement.setAttribute('data-brand', 'admin');
    
    // Check if user is already authenticated
    if (user && profile) {
      if (profile.role === 'admin' || profile.role === 'staff') {
        router.push('/admin/dashboard');
      } else {
        setError('Unauthorized: Your account does not have admin or staff access.');
        signOut();
      }
    }
  }, [user, profile, router, signOut]);

  // Check URL query parameters for unauthorized access attempts from middleware
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('Your current session does not have administrative privileges.');
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const res = await signInWithEmail(email);
    setLoading(false);
    
    if (res.success) {
      setOtpSent(true);
      setMessage('A secure 6-digit administrative authorization token has been sent to your email.');
    } else {
      setError(res.error || 'Failed to dispatch verification code. Please check your credentials.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await verifyOtp(email, otp);
    setLoading(false);
    
    if (res.success) {
      router.push('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid or expired administrative code. Access Denied.');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-md border border-[#1f2937] p-8 rounded-2xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-xl mx-auto shadow-md shadow-indigo-500/20">
          A
        </div>
        <h2 className="text-2xl font-black tracking-wider uppercase text-indigo-400 mt-4">Control Desk</h2>
        <p className="text-sm text-gray-400">
          Secure Administrator & Staff Gate
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 p-4 rounded-xl font-semibold">
          ⚠️ {error}
        </div>
      )}
      {message && (
        <div className="text-sm text-indigo-300 bg-indigo-950/50 border border-indigo-900/50 p-4 rounded-xl font-semibold">
          ✨ {message}
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Admin Email Address"
              type="email"
              placeholder="admin@anshuman-commerce.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1f2937]/50 border-[#374151] text-white focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-md shadow-indigo-600/10 transition"
          >
            {loading ? 'Processing...' : 'Send Access Token'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Administrative Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="bg-[#1f2937]/50 border-[#374151] text-white focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-md shadow-indigo-600/10 transition"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </Button>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="text-xs text-gray-500 hover:text-gray-300 block mx-auto mt-2 transition"
          >
            Change Email Address
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-[#f1f5f9] font-sans p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 -z-10" />
      <Suspense fallback={
        <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-md border border-[#1f2937] p-8 rounded-2xl shadow-2xl text-center text-gray-400">
          Loading login form...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
