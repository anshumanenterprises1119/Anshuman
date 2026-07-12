'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  tracking_number: string | null;
  carrier: string | null;
}

interface DigitalToken {
  id: string;
  token: string;
  download_count: number;
  max_downloads: number | null;
  product_name: string;
}

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

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  created_at: string;
}

export default function CustomerDashboardPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const { user, profile, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'downloads' | 'support'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<any[]>([]);
  
  const [digitalTokens, setDigitalTokens] = useState<DigitalToken[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState<'shipping' | 'billing'>('shipping');

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
    if (user) {
      loadDashboardData();
    }
  }, [user, brandSlug]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    // 1. Fetch brand
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .single();

    if (brand) {
      // 2. Fetch orders
      const { data: orderData } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, payment_status, created_at, tracking_number, carrier')
        .eq('brand_id', brand.id)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (orderData) {
        setOrders(orderData as Order[]);
        if (orderData.length > 0) setSelectedOrder(orderData[0]);
      }

      // 3. Fetch addresses
      const { data: addrData } = await supabase
        .from('addresses')
        .select('id, type, address_line1, address_line2, city, state, postal_code, is_default')
        .eq('profile_id', user.id);
      
      if (addrData) setAddresses(addrData as Address[]);

      // 4. Fetch Support Tickets
      const { data: ticketData } = await supabase
        .from('support')
        .select('id, subject, message, status, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ticketData) setTickets(ticketData as SupportTicket[]);

      // 5. If FutureWithAI, fetch active download tokens
      if (brandSlug === 'futurewithai') {
        const { data: tokenData } = await supabase
          .from('digital_access_tokens')
          .select(`
            id,
            token,
            download_count,
            max_downloads,
            order_items (
              products (
                name
              )
            )
          `)
          .eq('profile_id', user.id);

        if (tokenData) {
          const formatted = (tokenData as any[]).map((t) => ({
            id: t.id,
            token: t.token,
            download_count: t.download_count,
            max_downloads: t.max_downloads,
            product_name: t.order_items?.products?.name || 'Digital Product Pack',
          }));
          setDigitalTokens(formatted);
        }
      }
    }
    setLoading(false);
  };

  // Fetch tracking updates timeline for the selected order
  useEffect(() => {
    async function loadTracking() {
      if (!selectedOrder) return;
      const { data } = await supabase
        .from('order_tracking')
        .select('status, description, location, timestamp')
        .eq('order_id', selectedOrder.id)
        .order('timestamp', { ascending: false });
      
      if (data) setTrackingEvents(data);
    }
    loadTracking();
  }, [selectedOrder]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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

    if (!error) {
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      loadDashboardData();
    }
  };

  const handleRemoveAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    loadDashboardData();
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setTicketError('');
    setTicketSuccess('');

    const { error } = await supabase.from('support').insert({
      profile_id: user.id,
      subject: ticketSubject,
      message: ticketMessage,
      status: 'open',
    });

    if (!error) {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSuccess('Support ticket created successfully. Our team will contact you shortly.');
      loadDashboardData();
    } else {
      setTicketError('Failed to submit support ticket.');
    }
  };

  if (!user) {
    return (
      <div className="glass-card max-w-md mx-auto text-center py-12 space-y-4">
        <p className="text-[var(--text-secondary)]">Please sign in to access your dashboard.</p>
        <a href={`/${brandSlug}/login`} className="btn btn-primary">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Bar */}
      <div className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Hello, {profile?.full_name || 'Valued Buyer'}</h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage profile addresses, order timeline trackers, and digital keys.</p>
        </div>
        <Button variant="secondary" onClick={signOut}>Sign Out</Button>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {[
          { id: 'orders', label: '🛒 Orders Queue' },
          { id: 'addresses', label: '📍 Address Book' },
          { id: 'downloads', label: '📥 Downloads' },
          { id: 'support', label: '🛠️ Get Help' }
        ].map(tab => (
          (tab.id !== 'downloads' || brandSlug === 'futurewithai') && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-bold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          )
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Hydrating user dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main workspace */}
          <div className="md:col-span-2 space-y-6">
            
            {/* ORDERS TAB WITH TIMELINE */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-bold">Orders Timeline & History</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No order records found.</p>
                  ) : (
                    <div className="divide-y text-sm">
                      {orders.map(o => (
                        <div
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className={`py-4 cursor-pointer transition p-3 rounded-lg ${
                            selectedOrder?.id === o.id ? 'bg-[var(--primary-light)]' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">Order #{o.order_number}</p>
                              <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{o.total_amount}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-[var(--primary-color)] rounded-md border border-indigo-100 uppercase">
                                {o.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Order Tracking Timeline details */}
                {selectedOrder && (
                  <div className="glass-card p-6 space-y-6">
                    <h3 className="text-lg font-bold">Live Tracking Status: #{selectedOrder.order_number}</h3>
                    
                    <div className="relative border-l-2 border-gray-200 pl-6 ml-2 space-y-6 text-sm">
                      {trackingEvents.length === 0 ? (
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--primary-color)]"></div>
                          <p className="font-bold capitalize">{selectedOrder.status}</p>
                          <p className="text-xs text-gray-500">Order successfully logged in database pipeline.</p>
                        </div>
                      ) : (
                        trackingEvents.map((evt, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full ${idx === 0 ? 'bg-[var(--primary-color)] ring-4 ring-[var(--primary-light)]' : 'bg-gray-300'}`}></div>
                            <p className="font-bold">{evt.status}</p>
                            <p className="text-xs text-gray-600 mt-1">{evt.description}</p>
                            {evt.location && <p className="text-[10px] text-gray-400 mt-0.5">Location: {evt.location}</p>}
                            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(evt.timestamp).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESS BOOK TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                {/* List saved */}
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-bold">Saved Addresses</h3>
                  {addresses.length === 0 ? (
                    <p className="text-xs text-gray-400">No addresses saved yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="border rounded-xl p-4 space-y-2 relative bg-white shadow-sm">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary-color)] px-2 py-0.5 bg-gray-50 border rounded-md">
                            {addr.type} {addr.is_default && '(Default)'}
                          </span>
                          <p className="text-sm font-semibold text-gray-800 leading-snug mt-2">
                            {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}{addr.city}, {addr.state} - {addr.postal_code}
                          </p>
                          <button
                            onClick={() => handleRemoveAddress(addr.id)}
                            className="text-xs text-red-500 hover:underline block mt-4"
                          >
                            Delete Address
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add address Form */}
                <form onSubmit={handleAddAddress} className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-bold">Add New Address</h3>
                  
                  <div className="flex gap-2">
                    <label className="flex-1 text-center py-2 bg-gray-50 text-xs rounded font-bold cursor-pointer border">
                      <input type="radio" checked={addressType === 'shipping'} onChange={() => setAddressType('shipping')} className="mr-1" />
                      Shipping
                    </label>
                    <label className="flex-1 text-center py-2 bg-gray-50 text-xs rounded font-bold cursor-pointer border">
                      <input type="radio" checked={addressType === 'billing'} onChange={() => setAddressType('billing')} className="mr-1" />
                      Billing
                    </label>
                  </div>

                  <Input label="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
                  <Input label="Address Line 2 (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                  
                  <Input label="Postal Code / Pincode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  <Button type="submit" fullWidth>Save Address</Button>
                </form>
              </div>
            )}

            {/* DOWNLOADS TAB */}
            {activeTab === 'downloads' && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-bold">Digital Files Ready for Download</h3>
                {digitalTokens.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No digital deliverables mapped to this account.</p>
                ) : (
                  <div className="divide-y">
                    {digitalTokens.map(t => (
                      <div key={t.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-sm text-[var(--text-primary)]">{t.product_name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1">Downloads: {t.download_count} / {t.max_downloads || 'Unlimited'}</p>
                        </div>
                        <a
                          href={`/api/download/${t.token}`}
                          className="btn btn-primary text-xs py-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HELP TICKETS TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <form onSubmit={handleCreateTicket} className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-bold">Open a Support Ticket</h3>
                  {ticketError && <p className="text-xs text-red-500 font-semibold">{ticketError}</p>}
                  {ticketSuccess && <p className="text-xs text-green-600 font-semibold bg-green-50 p-2 border rounded-lg">{ticketSuccess}</p>}
                  <Input label="Subject / Topic Help" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Help with modular boards sizes etc." required />
                  
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-500">Describe your inquiry</label>
                    <textarea
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] outline-none min-h-[100px] text-sm text-[var(--text-primary)]"
                      required
                    />
                  </div>
                  <Button type="submit" fullWidth>Submit Support Query</Button>
                </form>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-bold">Inquiry History</h3>
                  {tickets.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No help tickets opened.</p>
                  ) : (
                    <div className="divide-y text-xs space-y-4">
                      {tickets.map(tk => (
                        <div key={tk.id} className="pt-4 flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{tk.subject}</p>
                            <p className="text-gray-500 mt-1">{tk.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Opened on {new Date(tk.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tk.status === 'open' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {tk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Account Profile sidebar card */}
          <div className="glass-card p-6 h-fit space-y-4 text-sm bg-white shadow-md border">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">User Profile</h3>
            <div className="divide-y text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[var(--text-secondary)]">Name</span>
                <span className="font-semibold">{profile?.full_name || 'Anonymous User'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[var(--text-secondary)]">Email</span>
                <span className="font-semibold truncate max-w-[150px]">{profile?.email}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[var(--text-secondary)]">Role</span>
                <span className="font-semibold capitalize text-indigo-600">{profile?.role}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Loyalty Level</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  (profile?.level || 'bronze') === 'gold' 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : (profile?.level || 'bronze') === 'silver' 
                    ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {profile?.level || 'bronze'}
                </span>
              </div>
            </div>

            {/* Loyalty Rewards Policy Details */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--primary-color)]">🏆 Loyalty Reward Rules</h4>
              <div className="space-y-2 text-[11px] text-gray-500 leading-normal">
                <div className="flex justify-between items-start gap-1 pb-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-700">🥉 Bronze Level:</span>
                  <span>Spend &lt; ₹5,000 (1 pt per ₹100)</span>
                </div>
                <div className="flex justify-between items-start gap-1 pb-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-700">🥈 Silver Level:</span>
                  <span>Spend &ge; ₹5,000 (Auto 5% discount)</span>
                </div>
                <div className="flex justify-between items-start gap-1">
                  <span className="font-semibold text-gray-700">🥇 Gold Level:</span>
                  <span>Spend &ge; ₹20,000 (Auto 10% discount)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
