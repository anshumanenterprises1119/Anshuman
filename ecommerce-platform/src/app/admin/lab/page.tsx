'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MockProduct {
  sku: string;
  name: string;
  price: number;
  category: string;
}

const MOCK_PRODUCTS: MockProduct[] = [
  { sku: 'MOCK-COB-01', name: 'Sandbox LED Spotlight 10W', price: 950, category: 'lighting' },
  { sku: 'MOCK-WIRE-02', name: 'Sandbox Copper Wire 1.0mm', price: 1400, category: 'cables' },
  { sku: 'MOCK-SW-03', name: 'Sandbox Crabtree Switch 2-Way', price: 80, category: 'switches' },
];

export default function OwnerLab() {
  const [activeWorkspace, setActiveWorkspace] = useState<'preview' | 'export'>('preview');
  const [labProducts, setLabProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('lighting');
  const router = useRouter();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const priceNum = parseFloat(newItemPrice);
    const newProduct: MockProduct = {
      sku: `LAB-MOCK-${Math.floor(100 + Math.random() * 900)}`,
      name: newItemName,
      price: priceNum,
      category: newItemCategory,
    };
    setLabProducts([...labProducts, newProduct]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleDiscardChanges = () => {
    if (confirm('⚠️ Are you sure you want to discard all sandbox additions? This will reset the laboratory state.')) {
      setLabProducts(MOCK_PRODUCTS);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(labProducts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", "lab_mock_catalog_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,SKU,Name,Price,Category\n";
    labProducts.forEach(p => {
      csvContent += `${p.sku},"${p.name}",${p.price},${p.category}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", "lab_mock_catalog_export.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-12 text-gray-200 font-sans">
      
      {/* Page Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#1e1b4b]/60 to-[#0f172a]/80 border border-indigo-950 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Owner Laboratory & Sandbox</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            Welcome to the isolated testing workspace. Try new layouts, draft product ideas, and export files. **Production writes (database, email triggers, webhooks) are strictly disabled here.**
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDiscardChanges}
            className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-bold transition"
          >
            🗑️ Discard Sandbox Data
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-800 gap-2">
        <button 
          onClick={() => setActiveWorkspace('preview')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all ${
            activeWorkspace === 'preview' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          🔬 Catalog Playground
        </button>
        <button 
          onClick={() => setActiveWorkspace('export')} 
          className={`pb-4 px-6 text-xs font-black tracking-wider uppercase border-b-2 transition-all ${
            activeWorkspace === 'export' ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          📥 Export Hub
        </button>
      </div>

      {/* TAB CONTENT: PLAYGROUND */}
      {activeWorkspace === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add product simulator form */}
          <div className="lg:col-span-1 bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4 h-fit">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Draft Mock Product</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Sandbox Lightbulb"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Price (INR)</label>
                <input 
                  type="number" 
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-600 focus:outline-none"
                >
                  <option value="lighting">Lighting</option>
                  <option value="cables">Cables & Wires</option>
                  <option value="switches">Switches & Accessories</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                🔬 Insert Mock Row
              </button>
            </form>
          </div>

          {/* Sandbox catalog table */}
          <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-gray-800 pb-3">Sandbox Catalog Rows ({labProducts.length} items)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-3 px-2">SKU</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {labProducts.map(p => (
                    <tr key={p.sku} className="hover:bg-gray-800/10">
                      <td className="py-3 px-2 font-mono text-gray-500">{p.sku}</td>
                      <td className="py-3 px-2 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-2 uppercase text-[9px] tracking-wider"><span className="bg-[#0b0f19] px-2 py-0.5 rounded text-indigo-400">{p.category}</span></td>
                      <td className="py-3 px-2 font-mono font-bold text-emerald-400">₹{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXPORT */}
      {activeWorkspace === 'export' && (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6">
          <span className="text-4xl">📥</span>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Export Mock Elements Hub</h3>
            <p className="text-xs text-gray-400">
              Download your playground configurations. No writes will be triggered to the production database; you must import these manually into your live Google Sheet if desired.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleExportJSON}
              className="px-5 py-3 bg-[#0b0f19] hover:bg-gray-850 text-indigo-400 border border-gray-800 rounded-xl text-xs font-bold transition"
            >
              📋 Download JSON File
            </button>
            <button
              onClick={handleExportCSV}
              className="px-5 py-3 bg-[#0b0f19] hover:bg-gray-850 text-indigo-400 border border-gray-800 rounded-xl text-xs font-bold transition"
            >
              📊 Download CSV Sheet
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
