'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export default function CustomerSettingsPage() {
  const { user, profile } = useAuth();
  
  // Profile settings state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Address book state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState<'shipping' | 'billing'>('shipping');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
    }
    if (user) {
      loadAddresses();
    }
  }, [user, profile]);

  const loadAddresses = async () => {
    try {
      if (!user) return;
      const { data } = await supabase
        .from('addresses')
        .select('id, type, address_line1, address_line2, city, state, postal_code, is_default')
        .eq('profile_id', user.id);
      
      if (data) setAddresses(data as Address[]);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSuccess('');
    setProfileError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
        })
        .eq('id', user.id);

      if (error) throw error;
      setProfileSuccess('Profile parameters updated successfully.');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setProfileError(err.message || 'Failed to update profile details.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddressError('');

    try {
      const { error } = await supabase.from('addresses').insert({
        profile_id: user.id,
        type: addressType,
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        city,
        state,
        postal_code: postalCode,
        is_default: addresses.length === 0,
      });

      if (error) throw error;

      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      loadAddresses();
    } catch (err: any) {
      console.error('Error inserting address:', err);
      setAddressError(err.message || 'Failed to register new address.');
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
      loadAddresses();
    } catch (err: any) {
      console.error('Error removing address:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure profile details and manage your billing/shipping addresses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile details */}
        <form onSubmit={handleUpdateProfile} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-gray-700">Personal Information</h2>
          
          {profileSuccess && <p className="text-xs text-green-600 bg-green-50 p-2 border border-green-100 rounded-lg">{profileSuccess}</p>}
          {profileError && <p className="text-xs text-red-500 font-semibold">{profileError}</p>}

          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
          />

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
          />

          <Button type="submit" className="w-full text-xs py-2 rounded-lg text-white">Save Personal Information</Button>
        </form>

        {/* Addresses book */}
        <div className="space-y-6">
          {/* Add address */}
          <form onSubmit={handleAddAddress} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700">Add New Address</h2>
            {addressError && <p className="text-xs text-red-500 font-semibold">{addressError}</p>}
            
            <div className="flex gap-2">
              <label className="flex-1 text-center py-2 bg-gray-50 text-[10px] rounded font-bold cursor-pointer border text-gray-600 select-none">
                <input type="radio" checked={addressType === 'shipping'} onChange={() => setAddressType('shipping')} className="mr-1 accent-[var(--primary-color)]" />
                Shipping
              </label>
              <label className="flex-1 text-center py-2 bg-gray-50 text-[10px] rounded font-bold cursor-pointer border text-gray-600 select-none">
                <input type="radio" checked={addressType === 'billing'} onChange={() => setAddressType('billing')} className="mr-1 accent-[var(--primary-color)]" />
                Billing
              </label>
            </div>

            <Input
              label="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
            />
            <Input
              label="Address Line 2 (Optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
              />
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
              />
            </div>
            
            <Input
              label="Postal Code / Pin"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className="bg-white border-gray-200 text-gray-900 text-xs focus:border-[var(--primary-color)]"
            />

            <Button type="submit" className="w-full text-xs py-2 rounded-lg text-white">Save Address</Button>
          </form>

          {/* List Addresses */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700">Saved Address Entries</h2>
            {addresses.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No saved addresses found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-150 bg-gray-50/50 p-4 rounded-xl relative text-xs">
                    <span className="text-[9px] font-black uppercase text-[var(--primary-color)] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                      {addr.type} {addr.is_default && '(Default)'}
                    </span>
                    <p className="text-gray-700 leading-snug font-medium mt-3">
                      {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}{addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="text-red-500 hover:text-red-750 font-bold mt-4 hover:underline block text-[10px]"
                    >
                      Delete Address
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
