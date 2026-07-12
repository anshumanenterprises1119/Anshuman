'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function CustomerProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', 'anshuman-enterprises');
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile && profile.role !== 'customer') {
        router.push('/admin/dashboard');
      } else {
        setAuthorized(true);
      }
    }
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-500 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold tracking-wider text-gray-400">Loading your profile data...</p>
        </div>
      </div>
    );
  }

  const profileLinks = [
    { href: '/profile', label: '👤 Profile Summary' },
    { href: '/profile/orders', label: '🛒 Order History' },
    { href: '/profile/tracking', label: '📦 Track Shipments' },
    { href: '/profile/wishlist', label: '❤️ Wishlist' },
    { href: '/profile/reviews', label: '✍️ Write Reviews' },
    { href: '/profile/settings', label: '⚙️ Profile Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar Menu */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)] flex items-center justify-center font-bold text-white shadow-md">
              🛒
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-700 tracking-tight">Customer Portal</h2>
              <p className="text-[10px] text-gray-400 font-bold font-mono">Role: {profile?.role}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {profileLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                    isActive
                      ? 'bg-[var(--primary-light)] text-[var(--primary-color)] shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="text-[10px] text-gray-400 space-y-1">
            <p className="truncate font-semibold text-gray-600">{profile?.email}</p>
            <p className="font-medium">&copy; Anshuman Enterprises</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 hover:text-red-600 text-xs font-bold rounded-lg transition"
          >
            Logout Profile
          </button>
        </div>
      </aside>

      {/* Workspace Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
