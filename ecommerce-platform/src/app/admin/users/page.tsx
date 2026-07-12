'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'customer' | 'staff' | 'admin';
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone_number, role')
        .order('created_at', { ascending: false });

      if (data) setProfiles(data as Profile[]);
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'customer' | 'staff' | 'admin') => {
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      loadProfiles();
    } catch (err: any) {
      console.error('Error updating user role:', err);
      alert(err.message || 'Failed to update user role permissions.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          User Permissions
        </h1>
        <p className="text-sm text-gray-400 mt-1">Review registered buyer emails, profile details, and authorize staff access.</p>
      </div>

      <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold">Registered Accounts Registry</h2>
        {loading ? (
          <div className="text-sm text-gray-400 py-6">Syncing registry...</div>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-gray-400 py-6">No user accounts found.</p>
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left divide-y divide-[#1f2937]">
              <thead>
                <tr className="text-gray-500 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">User Email</th>
                  <th className="pb-3">Full Name</th>
                  <th className="pb-3">Phone Number</th>
                  <th className="pb-3">Role Authority</th>
                  <th className="pb-3 text-right">Assign Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937] text-xs">
                {profiles.map((prof) => (
                  <tr key={prof.id} className="text-gray-300">
                    <td className="py-3 font-semibold">{prof.email}</td>
                    <td className="py-3 text-gray-400">{prof.full_name || 'Anonymous User'}</td>
                    <td className="py-3 font-mono text-[10px] text-gray-400">{prof.phone_number || 'Not Linked'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        prof.role === 'admin' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/50' :
                        prof.role === 'staff' ? 'bg-violet-950 text-violet-400 border border-violet-900/50' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {prof.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {updatingId === prof.id ? (
                        <span className="text-[10px] text-gray-500">Updating...</span>
                      ) : (
                        <select
                          value={prof.role}
                          onChange={(e) => handleRoleChange(prof.id, e.target.value as any)}
                          className="px-2 py-1.5 rounded-lg border border-[#374151] bg-[#1f2937] text-white text-[10px] outline-none cursor-pointer focus:border-indigo-500"
                        >
                          <option value="customer">Customer Role</option>
                          <option value="staff">Staff Access</option>
                          <option value="admin">Administrator Authority</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
