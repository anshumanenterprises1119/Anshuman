'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  type: 'physical' | 'digital';
  is_active: boolean;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  is_active: boolean;
}

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'orders' | 'customers' | 'coupons'>('metrics');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Form states for creating products/coupons
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdType, setNewProdType] = useState<'physical' | 'digital'>('physical');
  const [selectedBrand, setSelectedBrand] = useState('anshuman-enterprises');

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed_amount'>('percentage');

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', 'admin');
    if (!authLoading) {
      if (!user) {
        router.push('/anshuman-enterprises/login?redirect=/admin');
      } else if (profile && profile.role !== 'admin' && profile.role !== 'staff') {
        setAuthError(true);
        setLoading(false);
      } else {
        setAuthError(false);
        loadAdminData();
      }
    }
  }, [user, profile, authLoading, router]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const { data: prodData } = await supabase.from('products').select('id, name, sku, base_price, type, is_active').order('created_at', { ascending: false });
      if (prodData) setProducts(prodData as Product[]);

      // 2. Fetch Orders
      const { data: ordData } = await supabase.from('orders').select('id, order_number, total_amount, status, payment_status, created_at').order('created_at', { ascending: false });
      if (ordData) setOrders(ordData as Order[]);

      // 3. Fetch Customers
      const { data: custData } = await supabase.from('profiles').select('id, email, full_name, role');
      if (custData) setCustomers(custData as Customer[]);

      // 4. Fetch Coupons
      const { data: coupData } = await supabase.from('coupons').select('id, code, type, value, is_active').order('created_at', { ascending: false });
      if (coupData) setCoupons(coupData as Coupon[]);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
    setLoading(false);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: brand } = await supabase.from('brands').select('id').eq('slug', selectedBrand).single();
      if (!brand) return;

      const { data: product, error } = await supabase.from('products').insert({
        brand_id: brand.id,
        name: newProdName,
        slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: newProdSku || null,
        base_price: parseFloat(newProdPrice),
        type: newProdType,
        is_active: true,
      }).select('id').single();

      if (error) throw error;

      // If physical product, initialize default inventory row
      if (product && newProdType === 'physical') {
        await supabase.from('inventory').insert({
          product_id: product.id,
          quantity: 50,
          reserved: 0,
          low_stock_threshold: 5
        });
      }

      setNewProdName('');
      setNewProdSku('');
      setNewProdPrice('');
      loadAdminData();
    } catch (err) {
      console.error('Product Creation Error:', err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: brand } = await supabase.from('brands').select('id').eq('slug', 'futurewithai').single(); // Default coupons to FutureWithAI
      if (!brand) return;

      const { error } = await supabase.from('coupons').insert({
        brand_id: brand.id,
        code: newCouponCode.toUpperCase(),
        type: newCouponType,
        value: parseFloat(newCouponValue),
        is_active: true,
      });

      if (error) throw error;

      setNewCouponCode('');
      setNewCouponValue('');
      loadAdminData();
    } catch (err) {
      console.error('Coupon Creation Error:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'pending') nextStatus = 'processing';
    else if (currentStatus === 'processing') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';

    try {
      const { error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId);
      if (error) throw error;
      
      // Update order tracking timeline event log
      await supabase.from('order_tracking').insert({
        order_id: orderId,
        status: nextStatus,
        description: `Order status manually updated by administrator to: ${nextStatus}.`,
      });

      loadAdminData();
    } catch (err) {
      console.error('Order status update error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19] text-[#f1f5f9] font-sans animate-fade-in" style={{ margin: '-32px -16px', padding: '0' }}>
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-64 bg-[#111827] border-r border-[#1f2937] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1f2937] pb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">A</div>
            <h2 className="text-lg font-black tracking-wider uppercase text-indigo-400">Admin Panel</h2>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'metrics', label: '📊 Metrics & Analytics' },
              { id: 'products', label: '📦 Products Catalog' },
              { id: 'orders', label: '🛒 Orders Queue' },
              { id: 'customers', label: '👥 User Profiles' },
              { id: 'coupons', label: '🎟️ Promo Coupons' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1f2937] text-center text-xs text-gray-500">
          <p>Ecommerce platform Admin</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Control Desk</p>
        </div>
      </aside>

      {/* Main Workspace Panels */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {authError ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-red-500 font-bold text-lg">⚠️ Access Denied</p>
            <p className="text-gray-400 max-w-md mx-auto">Your account does not have admin or staff permissions to access this control desk.</p>
            <Button onClick={() => router.push('/anshuman-enterprises')}>Return to Storefront</Button>
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-gray-400">Syncing database registers...</div>
        ) : (
          <>
            {/* PANEL 1: METRICS & ANALYTICS */}
            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">Workspace Health & Analytics</h3>
                
                {/* Stats cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Total Sales Revenue</p>
                    <p className="text-3xl font-extrabold text-indigo-400">
                      ₹{orders.filter(o => o.status !== 'cancelled' && o.payment_status === 'paid').reduce((acc, o) => acc + o.total_amount, 0)}
                    </p>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Total Orders Placed</p>
                    <p className="text-3xl font-extrabold text-indigo-400">{orders.length}</p>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Active Accounts</p>
                    <p className="text-3xl font-extrabold text-indigo-400">{customers.length}</p>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Digital Products Count</p>
                    <p className="text-3xl font-extrabold text-indigo-400">
                      {products.filter(p => p.type === 'digital').length}
                    </p>
                  </div>
                </div>

                {/* Performance lists */}
                <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Latest Orders Queue</h4>
                  <div className="divide-y divide-[#1f2937] text-sm">
                    {orders.slice(0, 5).map(ord => (
                      <div key={ord.id} className="py-3 flex justify-between items-center">
                        <span>Order #{ord.order_number}</span>
                        <span className="font-mono text-indigo-400">₹{ord.total_amount}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-400">{ord.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL 2: PRODUCTS CATALOG */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* List */}
                <div className="md:col-span-2 space-y-4 bg-[#111827] border border-[#1f2937] p-6 rounded-2xl">
                  <h3 className="text-lg font-bold">Active Products List</h3>
                  <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left divide-y divide-[#1f2937]">
                      <thead>
                        <tr className="text-gray-500 uppercase text-xs">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">SKU</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Base Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f2937]">
                        {products.map(p => (
                          <tr key={p.id} className="text-gray-300">
                            <td className="py-3 font-semibold">{p.name}</td>
                            <td className="py-3 font-mono text-xs">{p.sku || 'N/A'}</td>
                            <td className="py-3 capitalize">{p.type}</td>
                            <td className="py-3 font-mono">₹{p.base_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Form */}
                <form onSubmit={handleCreateProduct} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-lg font-bold">Add New Product</h3>
                  
                  <div className="flex gap-2">
                    <label className="flex-1 text-center py-2 bg-gray-800 text-xs rounded font-semibold cursor-pointer border border-[#1f2937]">
                      <input type="radio" checked={selectedBrand === 'anshuman-enterprises'} onChange={() => setSelectedBrand('anshuman-enterprises')} className="mr-1" />
                      Anshuman
                    </label>
                    <label className="flex-1 text-center py-2 bg-gray-800 text-xs rounded font-semibold cursor-pointer border border-[#1f2937]">
                      <input type="radio" checked={selectedBrand === 'futurewithai'} onChange={() => setSelectedBrand('futurewithai')} className="mr-1" />
                      FutureWithAi
                    </label>
                  </div>

                  <Input label="Product Name" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} required className="bg-gray-800 border-[#1f2937] text-white" />
                  <Input label="SKU / Reference ID" value={newProdSku} onChange={(e) => setNewProdSku(e.target.value)} className="bg-gray-800 border-[#1f2937] text-white" />
                  <Input label="Base Price (INR)" type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} required className="bg-gray-800 border-[#1f2937] text-white" />
                  
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-500">Asset Type</label>
                    <select value={newProdType} onChange={(e) => setNewProdType(e.target.value as any)} className="w-full px-4 py-3 rounded-lg border border-[#1f2937] bg-gray-800 text-white outline-none">
                      <option value="physical">Physical Product</option>
                      <option value="digital">Digital Product</option>
                    </select>
                  </div>

                  <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-500">Create Catalog Item</Button>
                </form>
              </div>
            )}

            {/* PANEL 3: ORDERS QUEUE */}
            {activeTab === 'orders' && (
              <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold">Incoming Orders Queue</h3>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full text-left divide-y divide-[#1f2937]">
                    <thead>
                      <tr className="text-gray-500 uppercase text-xs">
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Grand Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Shipment Status</th>
                        <th className="pb-3 text-right">Action Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                      {orders.map(o => (
                        <tr key={o.id} className="text-gray-300">
                          <td className="py-3 font-semibold">#{o.order_number}</td>
                          <td className="py-3 font-mono">₹{o.total_amount}</td>
                          <td className="py-3 text-xs uppercase">{o.payment_status}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900 text-xs font-bold uppercase">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {o.status !== 'delivered' && o.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, o.status)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded"
                              >
                                Mark {o.status === 'pending' ? 'Processing' : o.status === 'processing' ? 'Shipped' : 'Delivered'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL 4: USER PROFILES */}
            {activeTab === 'customers' && (
              <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold">Registered Users Accounts</h3>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full text-left divide-y divide-[#1f2937]">
                    <thead>
                      <tr className="text-gray-500 uppercase text-xs">
                        <th className="pb-3">Customer Email</th>
                        <th className="pb-3">Full Name</th>
                        <th className="pb-3">Access Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                      {customers.map(c => (
                        <tr key={c.id} className="text-gray-300">
                          <td className="py-3 font-semibold">{c.email}</td>
                          <td className="py-3">{c.full_name || 'Anonymous User'}</td>
                          <td className="py-3 uppercase text-xs font-mono">{c.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL 5: PROMO COUPONS */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* List */}
                <div className="md:col-span-2 bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-bold">Active Promo Coupons</h3>
                  <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left divide-y divide-[#1f2937]">
                      <thead>
                        <tr className="text-gray-500 uppercase text-xs">
                          <th className="pb-3">Code</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Discount Value</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f2937]">
                        {coupons.map(c => (
                          <tr key={c.id} className="text-gray-300">
                            <td className="py-3 font-mono font-bold text-indigo-400">{c.code}</td>
                            <td className="py-3 capitalize">{c.type}</td>
                            <td className="py-3 font-mono">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.is_active ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                                {c.is_active ? 'ACTIVE' : 'EXPIRED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Form */}
                <form onSubmit={handleCreateCoupon} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-lg font-bold">Create Coupon</h3>
                  
                  <Input label="Coupon Code" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} placeholder="WELCOME10" required className="bg-gray-800 border-[#1f2937] text-white" />
                  <Input label="Discount Value" type="number" value={newCouponValue} onChange={(e) => setNewCouponValue(e.target.value)} required className="bg-gray-800 border-[#1f2937] text-white" />
                  
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-500">Discount Formula</label>
                    <select value={newCouponType} onChange={(e) => setNewCouponType(e.target.value as any)} className="w-full px-4 py-3 rounded-lg border border-[#1f2937] bg-gray-800 text-white outline-none">
                      <option value="percentage">Percentage Off (%)</option>
                      <option value="fixed_amount">Fixed Amount Off (INR)</option>
                    </select>
                  </div>

                  <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-500">Generate Coupon</Button>
                </form>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
}