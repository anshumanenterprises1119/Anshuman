'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

export default function CustomerLoginPage() {
  const { user, profile, signInWithEmail, verifyOtp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Set general storefront branding style
    document.documentElement.setAttribute('data-brand', 'anshuman-enterprises');
    
    if (user && profile) {
      if (profile.role === 'customer') {
        router.push('/profile');
      } else {
        // Logged in as admin/staff trying to see customer login -> redirect to admin
        router.push('/admin/dashboard');
      }
    }
  }, [user, profile, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const res = await signInWithEmail(email);
    setLoading(false);
    
    if (res.success) {
      setOtpSent(true);
      setMessage('A 6-digit verification code has been dispatched to your inbox.');
    } else {
      setError(res.error || 'Failed to dispatch verification code. Please check your email.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await verifyOtp(email, otp);
    setLoading(false);
    
    if (res.success) {
      router.push('/profile');
    } else {
      setError(res.error || 'Invalid OTP code. Please verify the code and try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Direct integration placeholder for Google Login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn('OAuth setup not completed on Supabase yet. Simulating auth...', err);
      setError('Google Sign-in integration is prepared. Connect your production credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-6">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 via-white to-violet-50 -z-10" />
      
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center font-bold text-white text-lg mx-auto shadow-md">
            🛒
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-800 mt-4">Welcome Back</h2>
          <p className="text-xs text-gray-500">
            Sign in to access your orders, track shipments, and download invoices.
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-3.5 rounded-xl font-semibold">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-100 p-3.5 rounded-xl font-semibold">
            ✨ {message}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2.5 transition duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.58c-.28 1.48-1.11 2.74-2.37 3.59v2.98h3.84c2.25-2.07 3.54-5.11 3.54-8.62z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.84-2.98c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.31v3.08c1.99 3.96 6.09 6.66 10.69 6.66z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.26c-.25-.72-.39-1.49-.39-2.26s.14-1.54.39-2.26V6.66H1.31c-.83 1.65-1.31 3.5-1.31 5.34s.48 3.69 1.31 5.34l3.93-3.08z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.4 0 3.3 2.7 1.31 6.66l3.93 3.08c.95-2.88 3.61-5.01 6.76-5.01z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <span className="relative px-3 bg-white text-[10px] uppercase font-bold text-gray-400">Or Email Code</span>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-gray-200 text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-light)] text-xs"
            />
            <Button type="submit" fullWidth disabled={loading} className="py-2.5 rounded-lg text-xs font-bold text-white shadow-md">
              {loading ? 'Sending Code...' : 'Get Login OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="bg-white border-gray-200 text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-light)] text-xs"
            />
            <Button type="submit" fullWidth disabled={loading} className="py-2.5 rounded-lg text-xs font-bold text-white shadow-md">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-xs text-gray-400 hover:text-gray-600 block mx-auto mt-2 transition"
            >
              Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
