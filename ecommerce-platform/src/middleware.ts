import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup basic supabase reader client inside middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lightweight IP Rate Limiter Cache
const ipCache = new Map<string, number[]>();
const LIMIT = 60; // Max 60 requests per minute
const WINDOW = 60000; // 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (!ipCache.has(ip)) {
    ipCache.set(ip, [now]);
    return false;
  }
  
  const timestamps = ipCache.get(ip)!.filter(ts => now - ts < WINDOW);
  timestamps.push(now);
  ipCache.set(ip, timestamps);
  
  return timestamps.length > LIMIT;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // 1. Rate Limiting for API routes
  if (path.startsWith('/api')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Rewrite rules for multi-brand routing at home
  if (path === '/') {
    if (host.includes('futurewithai')) {
      return NextResponse.rewrite(new URL('/futurewithai', request.url));
    }
    return NextResponse.rewrite(new URL('/anshuman-enterprises', request.url));
  }

  // 3. Exact /admin redirect to /admin/dashboard (keeps page.tsx untouched)
  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 4. Role and session guards
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login';
  const isCustomerRoute = path.startsWith('/profile');
  const isCustomerLoginRoute = path === '/login';
  const isAdminLoginRoute = path === '/admin/login';

  // Get specific tokens
  const adminToken = request.cookies.get('sb-admin-auth-token')?.value;
  const customerToken = request.cookies.get('sb-customer-auth-token')?.value;

  if (isAdminRoute) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Verify token role
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.auth.setSession({ access_token: adminToken, refresh_token: '' });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
            return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
          }
        } else {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  if (isCustomerRoute) {
    if (!customerToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Verify customer role
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.auth.setSession({ access_token: customerToken, refresh_token: '' });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!profile || profile.role !== 'customer') {
            // Admin/staff accessing customer route -> redirect to admin
            if (profile && (profile.role === 'admin' || profile.role === 'staff')) {
              return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
          }
        } else {
          return NextResponse.redirect(new URL('/login', request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // Redirect already authenticated users
  if (isCustomerLoginRoute && customerToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  if (isAdminLoginRoute && adminToken) {
    const res = NextResponse.redirect(new URL('/admin/dashboard', request.url));
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    return res;
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

// Route config matcher rules
export const config = {
  matcher: [
    '/',
    '/admin',
    '/admin/:path*',
    '/profile',
    '/profile/:path*',
    '/login',
    '/api/:path*',
  ],
};
