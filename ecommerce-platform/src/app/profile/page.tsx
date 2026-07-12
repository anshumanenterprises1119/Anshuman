'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';

interface Reward {
  id: string;
  points: number;
  reason: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function CustomerProfilePage() {
  const { user, profile } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // 1. Fetch rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('id, points, reason, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (rewardsData) setRewards(rewardsData as Reward[]);

      // 2. Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('id, title, message, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationsData) setNotifications(notificationsData as any[]);

      // 3. Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (ordersData) setRecentOrders(ordersData as Order[]);

    } catch (err) {
      console.error('Error loading customer dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = rewards.reduce((acc, r) => acc + r.points, 0);

  if (loading) {
    return <div className="text-xs text-gray-400">Syncing profile metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Account Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Hello, {profile?.full_name || 'Valued Buyer'}. Manage your profile checkpoints here.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rewards Summary */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Loyalty Rewards Points</p>
            <p className="text-3xl font-black text-[var(--primary-color)]">{totalPoints} Points</p>
            <p className="text-xs text-gray-400">Points earned from shopping rewards</p>
          </div>
          <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-2xl flex items-center justify-center text-xl font-bold">
            🏆
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Account Specifications</h2>
          <div className="text-xs space-y-2 text-gray-600">
            <p><span className="font-semibold text-gray-500">Linked Email:</span> {profile?.email}</p>
            <p><span className="font-semibold text-gray-500">Contact Number:</span> {profile?.phone_number || 'No contact added'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Recent Purchase Logs</h2>
          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No purchases recorded yet.</p>
          ) : (
            <div className="divide-y divide-gray-50 text-xs">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">Order #{ord.order_number}</p>
                    <p className="text-[10px] text-gray-400">{new Date(ord.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{Number(ord.total_amount).toLocaleString()}</p>
                    <span className="text-[9px] font-bold text-[var(--primary-color)] bg-[var(--primary-light)] px-2 py-0.5 rounded uppercase">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feed Notifications */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Recent Updates Feed</h2>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Your notification tray is empty.</p>
          ) : (
            <div className="space-y-3.5">
              {notifications.map((note) => (
                <div key={note.id} className="text-xs p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="font-bold text-gray-800 leading-snug">{note.title}</p>
                  <p className="text-gray-500 leading-normal text-[10px]">{note.message}</p>
                  <p className="text-[9px] text-gray-400">{new Date(note.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
