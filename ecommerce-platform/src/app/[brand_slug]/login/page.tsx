'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { user, signInWithEmail, verifyOtp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
    if (user) {
      router.push(`/${brandSlug}/dashboard`);
    }
  }, [user, brandSlug, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const res = await signInWithEmail(email);
    setLoading(false);
    
    if (res.success) {
      setOtpSent(true);
      setMessage('A 6-digit verification code has been sent to your email.');
    } else {
      setError(res.error || 'Failed to send OTP. Please check your email address.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await verifyOtp(email, otp);
    setLoading(false);
    
    if (res.success) {
      router.push(`/${brandSlug}/dashboard`);
    } else {
      setError(res.error || 'Invalid OTP code. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Sign in to your {brandSlug === 'futurewithai' ? 'FutureWithAI' : 'Anshuman Enterprises'} account.
          </p>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 p-3 rounded-lg font-semibold">{error}</p>}
        {message && <p className="text-sm text-green-600 bg-green-50 border border-green-100 p-3 rounded-lg font-semibold">{message}</p>}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Login OTP'}
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
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-xs text-[var(--text-secondary)] hover:underline block mx-auto mt-2"
            >
              Change Email Address
            </button>
          </form>
        )}

        <div className="border-t pt-4 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href={`/${brandSlug}/signup`} className="font-semibold text-[var(--primary-color)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
