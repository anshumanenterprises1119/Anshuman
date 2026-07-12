'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

interface Stats {
  revenue: number;
  orders: number;
  users: number;
  tickets: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, users: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch revenue & total orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_amount, status, payment_status');
        
        let revenue = 0;
        let ordersCount = 0;
        if (ordersData) {
          ordersCount = ordersData.length;
          revenue = ordersData
            .filter((o) => o.status !== 'cancelled' && o.payment_status === 'paid')
            .reduce((acc, o) => acc + Number(o.total_amount), 0);
        }

        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        // Fetch open support tickets
        const { count: ticketsCount } = await supabase
          .from('support')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open');

        setStats({
          revenue,
          orders: ordersCount,
          users: usersCount || 0,
          tickets: ticketsCount || 0
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-sm">Syncing system telemetry...</div>;
  }

  const statCards = [
    { title: 'Total Sales Revenue', value: `₹${stats.revenue.toLocaleString()}`, change: 'Database direct', color: 'text-indigo-400' },
    { title: 'Total Orders Logged', value: stats.orders.toString(), change: 'Lifetime activity', color: 'text-violet-400' },
    { title: 'Registered Users', value: stats.users.toString(), change: 'Auth credentials', color: 'text-emerald-400' },
    { title: 'Open Tickets', value: stats.tickets.toString(), change: 'Awaiting support reply', color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Telemetry Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">Real-time status overview of Anshuman Enterprises & FutureWithAI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-2 shadow-sm shadow-indigo-950/5 hover:translate-y-[-1px] transition-all duration-200">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{card.title}</p>
            <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Shortcuts/Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#f1f5f9]">Quick Administration Controls</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Use the sidebar controls to process incoming orders, upload or modify catalog descriptions, update CMS pages, edit customer permissions, and check database analytics charts.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#f1f5f9]">Database & System Health</h2>
          <div className="text-sm space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Database Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px]">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Supabase API Endpoint:</span>
              <span className="text-indigo-400 font-mono text-[10px]">aws-0-ap-south-1</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Current Local Time:</span>
              <span className="text-gray-300 font-mono text-[10px]">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
