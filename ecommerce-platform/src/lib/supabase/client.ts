import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not defined in your environment variables.');
}

// Determine if we are on the admin path to isolate storage/sessions dynamically
const getStorageKey = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/admin')
      ? 'sb-admin-session'
      : 'sb-customer-session';
  }
  return 'sb-customer-session';
};

// Client for web browser requests governed by Postgres Row Level Security (RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: getStorageKey(),
    persistSession: true,
    detectSessionInUrl: true,
  },
});
