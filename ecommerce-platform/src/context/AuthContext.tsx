'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'customer' | 'staff' | 'admin';
  level?: 'bronze' | 'silver' | 'gold';
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile details
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  useEffect(() => {
    const setAuthCookie = (token: string | null) => {
      if (typeof window === 'undefined') return;
      const isAdmin = window.location.pathname.startsWith('/admin');
      const cookieName = isAdmin ? 'sb-admin-auth-token' : 'sb-customer-auth-token';
      const path = isAdmin ? '/admin' : '/';
      const maxAge = isAdmin ? 60 * 60 * 24 : 60 * 60 * 24 * 7; // 1 day vs 7 days

      if (token) {
        document.cookie = `${cookieName}=${token}; path=${path}; max-age=${maxAge}; SameSite=Lax; Secure`;
      } else {
        // Clear both cookies to ensure proper logout
        document.cookie = `sb-admin-auth-token=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `sb-customer-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    };

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        setAuthCookie(session.access_token);
      } else {
        setAuthCookie(null);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          setAuthCookie(session.access_token);
        } else {
          setProfile(null);
          setAuthCookie(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send OTP');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'OTP verification failed');

      // Save token locally in Supabase client instance
      await supabase.auth.setSession({
        access_token: result.token,
        refresh_token: '',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithEmail,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
