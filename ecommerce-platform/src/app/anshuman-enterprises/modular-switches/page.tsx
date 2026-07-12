'use client';

import React, { useEffect } from 'react';
import { Button } from '../../../components/ui/Button';

export default function ModularSwitchesPage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-brand', 'anshuman-enterprises');
  }, []);

  return (
    <div className="space-y-12 animate-fade-in" style={{ color: '#1a1a1a' }}>
      
      {/* 1. Page Hero Banner */}
      <section className="bg-[#4d1017] text-white rounded-2xl p-8 md:p-12 space-y-4 relative overflow-hidden shadow-lg border-b-4 border-[#c9a84c]">
        <span className="inline-block px-3 py-1 bg-[#c9a84c]/20 border border-[#c9a84c] text-[#e8c96a] text-xs uppercase font-mono tracking-wider rounded-full">
          Designer Collection
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Modular Switches & Accessories
        </h1>
        <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl">
          Elegant designs meet uncompromising safety. Authorized dealer for Panasonic Roma, Anchor, Havells, and GreatWhite modular switch designs in Greater Noida.
        </p>
      </section>

      {/* 2. Main Content Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left/Center Main Column */}
        <div className="md:col-span-2 space-y-8 bg-white p-6 md:p-8 border rounded-2xl shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#4d1017]" style={{ fontFamily: 'Georgia, serif' }}>
              Premium Modular Switches in Greater Noida
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Switches are the most touched elements in your home. They should not only be safe but also complement your interior design. Anshuman Enterprises brings you a curated collection of modular switches and accessories that combine aesthetic appeal with high mechanical endurance.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#4d1017]">Our Product Portfolio</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <li className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <strong>Modular Switches & Sockets:</strong> 1-way, 2-way, and bell switches in various module sizes.
              </li>
              <li className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <strong>Regulators & Dimmers:</strong> Humming-free fan speed controllers and smooth light dimmers.
              </li>
              <li className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <strong>Smart Home Switches:</strong> Wi-Fi enabled touch switches that work with Alexa or mobile apps.
              </li>
              <li className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <strong>Designer Plates:</strong> Glass, metal, and wood finish cover plates to match wall textures.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#4d1017]">Top Brands We Deal In</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 border rounded-xl text-center font-bold text-sm bg-gray-50 text-[#4d1017]">Panasonic Roma</div>
              <div className="p-4 border rounded-xl text-center font-bold text-sm bg-gray-50 text-[#4d1017]">Havells Crabtree</div>
              <div className="p-4 border rounded-xl text-center font-bold text-sm bg-gray-50 text-[#4d1017]">GreatWhite</div>
              <div className="p-4 border rounded-xl text-center font-bold text-sm bg-gray-50 text-[#4d1017]">L&T Entice</div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-6 bg-[#faf7f2] border-l-4 border-[#c9a84c] rounded-r-xl space-y-4">
            <h4 className="font-bold text-lg text-[#4d1017]">Need a custom Switch BOQ Estimator?</h4>
            <p className="text-xs text-gray-600">
              Building a new home or workspace? Send us your drawing estimates and get special bulk rate configurations.
            </p>
            <a href="mailto:anshumanenterprises1119@gmail.com" className="btn btn-primary bg-[#c9a84c] text-black border-[#c9a84c] hover:bg-[#e8c96a]">
              Request a Switch BOQ
            </a>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Help Widget */}
          <div className="glass-card p-6 bg-white border border-[#4d1017]/10 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-[#4d1017]">Selection Help</h3>
            <p className="text-xs text-gray-500">Confused between Roma and Crabtree? Let our engineers guide you.</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/917065815743?text=Price%20Enquiry%20for%20Modular%20Switches"
                className="btn btn-secondary border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50 hover:border-green-400 text-center text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="tel:+917065815743"
                className="btn btn-secondary border-[#c9a84c]/20 text-[#4d1017] bg-[#faf7f2] hover:bg-[#faf7f2]/80 text-center text-xs"
              >
                📞 Call +91 70658 15743
              </a>
            </div>
          </div>

          {/* Bullet specifications */}
          <div className="glass-card p-6 bg-[#faf7f2] border border-gray-200 space-y-3">
            <h4 className="font-bold text-sm text-[#4d1017]">Why Buy Modular?</h4>
            <ul className="text-xs space-y-2 text-gray-600">
              <li>✓ Easy to Install & Replace modules</li>
              <li>✓ Child-Safe Shuttered Sockets</li>
              <li>✓ Fire Retardant self-extinguishing housing</li>
              <li>✓ Up to 100,000 Click Durability</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
