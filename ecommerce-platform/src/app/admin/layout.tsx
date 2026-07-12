'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', 'admin');
    if (!loading && !isLoginPage) {
      if (!user) {
        router.push('/admin/login');
      } else if (profile && profile.role !== 'admin' && profile.role !== 'staff') {
        router.push('/admin/login?error=unauthorized');
      } else {
        setAuthorized(true);
      }
    }
  }, [user, profile, loading, router, isLoginPage]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // If login page, render children directly without dashboard structure
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || (!authorized && !isLoginPage)) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-gray-400 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wider">Establishing secure admin session...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin/dashboard', label: '📊 Dashboard Overview' },
    { href: '/admin/cms', label: '✍️ CMS Management' },
    { href: '/admin/orders', label: '🛒 Orders Queue' },
    { href: '/admin/products', label: '📦 Products Catalog' },
    { href: '/admin/analytics', label: '📈 Detailed Analytics' },
    { href: '/admin/users', label: '👥 User Roles' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19] text-[#f1f5f9] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111827] border-r border-[#1f2937] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1f2937] pb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase text-indigo-400">Control Desk</h2>
              <p className="text-[10px] text-gray-500 font-mono">Role: {profile?.role}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1f2937] space-y-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="truncate font-semibold text-gray-400">{profile?.email}</p>
            <p>Admin Core v1.0.0</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 bg-red-950/40 hover:bg-red-900/30 border border-red-900/40 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Workspace Workspace */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
