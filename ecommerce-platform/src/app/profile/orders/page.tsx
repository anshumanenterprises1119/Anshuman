'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  total: number;
  products: {
    name: string;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const { data } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          subtotal,
          discount_amount,
          shipping_fee,
          payment_method,
          payment_status,
          created_at,
          order_items (
            id,
            price,
            quantity,
            total,
            products (
              name
            )
          )
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data as unknown as Order[]);
    } catch (err) {
      console.error('Error loading order history:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerPrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    const confirmCancel = confirm(`Are you sure you want to cancel order #${orderNumber}?`);
    if (!confirmCancel) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      // Trigger notification hook
      if (user) {
        await supabase.from('notifications').insert({
          profile_id: user.id,
          title: 'Order Cancelled',
          message: `Your purchase request (Order #${orderNumber}) has been successfully cancelled.`,
          type: 'order_update',
        });
      }

      loadOrders();
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Failed to cancel order.');
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-400">Syncing order lists...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Printable CSS Hack */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Order Logs & Invoices</h1>
        <p className="text-xs text-gray-500 mt-1">Review details for all past purchases and print digital receipts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center text-xs text-gray-400">
            No order records found in database.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-700">Order Ref: #{ord.order_number}</p>
                    <p className="text-[10px] text-gray-400">Date: {new Date(ord.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-color)] rounded-md border border-[var(--primary-light)]">
                      Fulfillment: {ord.status}
                    </span>
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-gray-50 text-gray-600 rounded-md border">
                      Payment: {ord.payment_status}
                    </span>
                    <button
                      onClick={() => setInvoiceOrder(ord)}
                      className="px-3 py-1.5 border border-indigo-100 hover:border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold rounded-lg text-[10px] transition"
                    >
                      View Invoice
                    </button>
                    {(ord.status === 'pending' || ord.status === 'processing') && (
                      <button
                        onClick={() => handleCancelOrder(ord.id, ord.order_number)}
                        className="px-3 py-1.5 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-lg text-[10px] transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2 text-xs">
                  {ord.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-gray-600 py-1">
                      <span>{item.products?.name || 'Deliverable'} x {item.quantity}</span>
                      <span className="font-mono text-gray-800">₹{Number(item.total).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-gray-800 border-t border-gray-50 pt-2.5">
                    <span>Total Amount Paid</span>
                    <span className="font-mono">₹{Number(ord.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal Overlay */}
      {invoiceOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal actions */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-gray-800">Digital Tax Receipt</h3>
              <div className="flex gap-2">
                <Button onClick={triggerPrint} className="text-xs py-1.5 px-3 rounded-lg text-white">Print / PDF</Button>
                <Button onClick={() => setInvoiceOrder(null)} variant="secondary" className="text-xs py-1.5 px-3 rounded-lg text-gray-500">Close</Button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-invoice" className="space-y-6 text-xs text-gray-700 bg-white p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-gray-800">ANSHUMAN ENTERPRISES</h2>
                  <p className="text-[10px] text-gray-400 mt-1">Gwalior, Madhya Pradesh, India</p>
                  <p className="text-[10px] text-gray-400">GSTIN: 23ABCDE1234F1Z5</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 text-sm">INVOICE</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Invoice #: {invoiceOrder.order_number}</p>
                  <p className="text-[10px] text-gray-400">Date: {new Date(invoiceOrder.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Items Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 font-bold border-b border-gray-100 pb-2">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoiceOrder.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 font-semibold text-gray-800">{item.products?.name || 'Deliverable'}</td>
                      <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="py-2.5 text-right font-mono">₹{Number(item.price).toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-gray-800">₹{Number(item.total).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr className="border-gray-100" />

              {/* Invoice Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{Number(invoiceOrder.subtotal).toLocaleString()}</span>
                  </div>
                  {invoiceOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{Number(invoiceOrder.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Fee:</span>
                    <span className="font-mono">₹{Number(invoiceOrder.shipping_fee).toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-gray-800 text-sm">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{Number(invoiceOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 pt-8 text-center">
                Thank you for shopping with Anshuman Enterprises. This is a computer-generated tax receipt.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
