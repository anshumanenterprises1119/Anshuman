'use client';

import React, { useEffect } from 'react';

export default function ReturnShippingPolicyPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
  }, [brandSlug]);

  const isFuture = brandSlug === 'futurewithai';

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in space-y-8 text-gray-800">
      <div className="glass-card bg-white p-8 border rounded-2xl shadow-md space-y-6">
        <div className="border-b pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-color)]">
            Fulfillment Guidelines
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-gray-900">
            Return & Shipping Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: June 24, 2026
          </p>
        </div>

        {isFuture ? (
          // FutureWithAi Digital Returns & Shipping
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            {/* Returns */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">↩️</span>
                <h3 className="text-base font-bold text-gray-900">7-Day Refund Guarantee</h3>
              </div>
              <p>
                We offer a transparent <strong>7-Day Refund Policy</strong> on all digital products (n8n packages, PHP scripts, Prompt templates) if the item is verified as defective or does not match catalog parameters.
              </p>
              <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                <strong>Refund Limit Audit:</strong> Refunds are only processed if the target digital asset has been downloaded 2 or fewer times from your secure downloads vault library. This prevents exploitation of digital source files.
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Shipping */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <h3 className="text-base font-bold text-gray-900">Instant Digital Shipping</h3>
              </div>
              <p>
                Since our inventory consists entirely of digital files, there are no physical shipping rules. Fulfillments are <strong>instantaneous</strong>. Upon successful payment verification:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your purchases will instantly sync inside your <a href="/futurewithai/library" className="text-[var(--primary-color)] hover:underline">Vault Library</a>.</li>
                <li>A secure download token will be generated under <a href="/account/downloads" className="text-[var(--primary-color)] hover:underline">Download Delivery</a>.</li>
                <li>A delivery confirmation email with download links will be dispatched automatically by our simulated mail server.</li>
              </ul>
            </div>
          </div>
        ) : (
          // Anshuman Enterprises Physical Returns & Shipping
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            {/* Returns banner */}
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-extrabold text-base">
                <span>🚫</span>
                <h3>Strict No-Return & No-Replacement Policy</h3>
              </div>
              <p className="text-red-900/90 text-xs">
                Anshuman Enterprises enforces a strict all-sales-final policy. We do not accept returns or replacements on any physical cables, switches, lighting fixtures, or circuit breakers. Customers are required to inspect the technical parameters and product conditions at our wholesale warehouse before confirmation.
              </p>
            </div>

            {/* Approved Refund Processing */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Refund Processing Timeline</h3>
              <p>
                In the rare instance that a refund is manually approved by Anshuman Enterprises management due to delivery fulfillment failures, it will be credited back to the original source account (UPI, Credit/Debit card, or net banking) within <strong>7 working days</strong>.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Shipping details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🚚</span>
                <h3 className="text-base font-bold text-gray-900">Shipping & Site Delivery Rules</h3>
              </div>
              <p>
                As a Greater Noida wholesale supplier, we support both in-person warehouse pickup and on-site distribution deliveries:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>In-Person Warehouse Pickup:</strong> Free of charge. Ready within 2 hours of payment clearance.</li>
                <li><strong>Home & Construction Site Delivery:</strong> Available for local Greater Noida deliveries. Delivery will be arranged within <strong>7 working days</strong> once the full wholesale invoice amount is settled in advance.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
