'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Shipment parameters
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, payment_status, tracking_number, carrier, created_at')
        .order('created_at', { ascending: false });

      if (data) setOrders(data as Order[]);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCarrier(order.carrier || 'BlueDart');
    setTrackingNumber(order.tracking_number || '');
    setStatus(order.status);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const updates: any = {
        status,
        carrier: carrier || null,
        tracking_number: trackingNumber || null,
      };

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Log status change inside order_tracking timeline
      await supabase.from('order_tracking').insert({
        order_id: selectedOrder.id,
        status: status.toUpperCase(),
        description: `Order dispatch status set to ${status.toUpperCase()} by administrator. Carrier: ${carrier || 'None'}, Ref: ${trackingNumber || 'None'}.`,
        location: 'Mumbai sorting hub'
      });

      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert(err.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Orders Pipeline
        </h1>
        <p className="text-sm text-gray-400 mt-1">Monitor buyer orders, trigger shipment updates, and assign tracking numbers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Listing of Orders */}
        <div className="md:col-span-2 bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold">Incoming Orders Queue</h2>
          {loading ? (
            <div className="text-sm text-gray-400 py-6">Syncing registry...</div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">No orders registered in the system.</p>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left divide-y divide-[#1f2937]">
                <thead>
                  <tr className="text-gray-500 uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Grand Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937] text-xs">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="text-gray-300">
                      <td className="py-3 font-semibold">#{ord.order_number}</td>
                      <td className="py-3 font-mono">₹{Number(ord.total_amount).toLocaleString()}</td>
                      <td className="py-3 text-[10px] font-bold uppercase text-indigo-400">{ord.payment_status}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-950 text-indigo-400 border border-indigo-900/50 uppercase">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleSelectOrder(ord)}
                          className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-900 hover:bg-indigo-900 hover:text-white transition rounded font-bold text-[10px]"
                        >
                          Dispatch / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dispatch Form Panel */}
        <div>
          {selectedOrder ? (
            <form onSubmit={handleUpdateOrder} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-[#f1f5f9]">Dispatch Order #{selectedOrder.order_number}</h2>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Order Delivery Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#374151] bg-[#1f2937] text-white text-xs outline-none focus:border-indigo-500"
                >
                  <option value="pending">Pending Review</option>
                  <option value="processing">Processing & Packaged</option>
                  <option value="shipped">Dispatched / Shipped</option>
                  <option value="delivered">Successfully Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Input
                label="Carrier / Shipping Provider"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Shiprocket, BlueDart, Delhivery"
                className="bg-[#1f2937] border-[#374151] text-white text-xs"
              />

              <Input
                label="Tracking Waybill Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="AWB1002930219"
                className="bg-[#1f2937] border-[#374151] text-white text-xs"
              />

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-xs py-2 rounded-lg font-bold text-white shadow-md">
                  Update Order
                </Button>
                <Button type="button" onClick={() => setSelectedOrder(null)} variant="secondary" className="flex-1 text-xs py-2 rounded-lg text-gray-400 bg-gray-800 border-gray-700 hover:bg-gray-700">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-[#111827]/40 border border-[#1f2937]/50 border-dashed p-6 rounded-2xl text-center text-gray-500 text-xs leading-relaxed">
              Select an order record from the queue to process fulfillment and assign waybills.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
