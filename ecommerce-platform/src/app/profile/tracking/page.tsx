'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';

interface Order {
  id: string;
  order_number: string;
  carrier: string | null;
  tracking_number: string | null;
}

interface Checkpoint {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface TrackingData {
  tracking_provider: string;
  tracking_number: string;
  tracking_status: 'outbound' | 'in_transit' | 'out_for_delivery' | 'delivered';
  tracking_history: Checkpoint[];
}

export default function CustomerTrackingPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadShippedOrders();
    }
  }, [user]);

  const loadShippedOrders = async () => {
    setLoadingOrders(true);
    try {
      if (!user) return;

      const { data } = await supabase
        .from('orders')
        .select('id, order_number, carrier, tracking_number')
        .eq('profile_id', user.id);

      if (data) {
        const filtered = data as Order[];
        setOrders(filtered);
        if (filtered.length > 0) {
          setSelectedOrderId(filtered[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading shipped orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (selectedOrderId) {
      fetchTrackingInfo();
    }
  }, [selectedOrderId]);

  const fetchTrackingInfo = async () => {
    const activeOrder = orders.find((o) => o.id === selectedOrderId);
    if (!activeOrder) return;

    if (!activeOrder.carrier || !activeOrder.tracking_number) {
      setTrackingData(null);
      setError('No tracking details (carrier/waybill) have been assigned to this order yet.');
      return;
    }

    setLoadingTracking(true);
    setError('');
    try {
      const res = await fetch(`/api/tracking/${activeOrder.carrier}/${activeOrder.tracking_number}`);
      if (!res.ok) throw new Error('Failed to retrieve tracking data');
      const data = await res.json();
      setTrackingData(data as TrackingData);
    } catch (err: any) {
      setError(err.message || 'Error communicating with tracking provider.');
      setTrackingData(null);
    } finally {
      setLoadingTracking(false);
    }
  };

  const statusProgress = {
    outbound: 1,
    in_transit: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  const currentStep = trackingData ? statusProgress[trackingData.tracking_status] : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Shipment Tracking</h1>
        <p className="text-xs text-gray-500 mt-1">Select an order below to query the real-time shipping carrier log.</p>
      </div>

      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
        {loadingOrders ? (
          <div className="text-xs text-gray-400">Loading order lists...</div>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No purchases recorded under this profile.</p>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Choose Purchase Order</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[var(--primary-color)]"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.order_number} {(!o.carrier || !o.tracking_number) ? '(Unshipped)' : '(Shipped)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {loadingTracking ? (
          <div className="text-xs text-gray-400 py-6">Connecting to carrier databases...</div>
        ) : error ? (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 p-4 rounded-xl font-medium">
            ⚠️ {error}
          </div>
        ) : trackingData ? (
          <div className="space-y-8 pt-4">
            {/* Carrier overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Logistics Partner</p>
                <p className="font-bold text-gray-700 mt-1">{trackingData.tracking_provider}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Waybill Reference</p>
                <p className="font-mono font-bold text-gray-700 mt-1">{trackingData.tracking_number}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Current Status</p>
                <p className="font-bold text-[var(--primary-color)] mt-1 uppercase text-[10px]">{trackingData.tracking_status.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Checkpoints Count</p>
                <p className="font-bold text-gray-700 mt-1">{trackingData.tracking_history.length} Updates</p>
              </div>
            </div>

            {/* Visual Steps Tracker */}
            <div className="flex justify-between items-center max-w-md mx-auto relative pt-4 pb-2">
              <div className="absolute left-2 right-2 top-6 h-0.5 bg-gray-200 -z-10" />
              <div
                className="absolute left-2 top-6 h-0.5 bg-[var(--primary-color)] -z-10 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[
                { label: 'Outbound', step: 1 },
                { label: 'In Transit', step: 2 },
                { label: 'Out for Delivery', step: 3 },
                { label: 'Delivered', step: 4 },
              ].map((s) => {
                const isPassed = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div key={s.step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                        isCurrent ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] ring-4 ring-[var(--primary-light)]' :
                        isPassed ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' :
                        'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {s.step}
                    </div>
                    <span className={`text-[9px] font-bold ${isPassed ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* History Checkpoints Timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Fulfillment Checkpoint Log</h3>
              <div className="relative border-l border-gray-200 pl-5 ml-2.5 space-y-6 text-xs text-gray-600">
                {trackingData.tracking_history.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full border bg-white ${
                      idx === 0 ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-light)]' : 'border-gray-300'
                    }`} />
                    <p className="font-bold text-gray-800">{evt.status}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{evt.description}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Location: {evt.location} | {new Date(evt.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
