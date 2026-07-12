'use client';

import React, { useEffect } from 'react';

export default function TermsOfUsePage({ params }: { params: { brand_slug: string } }) {
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
            Legal Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-gray-900">
            Terms of Use & Conditions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: June 24, 2026
          </p>
        </div>

        {isFuture ? (
          // FutureWithAi Terms of Use
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            <p>
              Welcome to <strong>FutureWithAi</strong>. By accessing our digital templates, scripts, or n8n packages, you agree to comply with the terms and conditions outlined below.
            </p>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">1. Digital Licensing Model</h3>
              <p>
                All digital items (n8n packages, PHP scripts, Prompt blueprints) are sold under a single-user, non-transferable license. You are permitted to modify the scripts for client projects, but resale or public redistribution of the raw source files is strictly prohibited.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">2. Download Limits & Secure Vault</h3>
              <p>
                Each purchase grants access via our secure download dashboard. We monitor download frequency and IPs. Accounts exhibiting excessive, parallel IP downloads are subject to immediate license key suspension and secure token revocation to protect intellectual property.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">3. Liability & Warranties</h3>
              <p>
                Automation workflows are provided &quot;as-is&quot; without guarantees of API uptime from external integrations (e.g. OpenAI, WhatsApp Webhook). We are not responsible for database overflows or API cost surges caused by autonomous agent loops.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">4. Refund Enforcement</h3>
              <p>
                Our 7-day refund guarantee is valid only if the item has not been downloaded more than twice. Verified code defects are fully resolved or refunded upon verification by our support desk.
              </p>
            </div>
          </div>
        ) : (
          // Anshuman Enterprises Physical Terms of Use
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            <p>
              These Terms and Conditions govern wholesale transactions, retail sales, and commercial electrical contracting services provided by <strong>Anshuman Enterprises</strong> in Greater Noida.
            </p>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">1. Genuine Product & Manufacturer Warranty</h3>
              <p>
                We warrant that all cables, miniature circuit breakers (MCBs), switches, and lighting products supplied by us are 100% authentic, sourced directly from manufacturers like Polycab, Havells, Crabtree, Legrand, and Orient. All brand warranties are honored directly by the respective manufacturers.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">2. Wholesale Quotes & GST Requirements</h3>
              <p>
                All project estimates, catalog quotes, and pricing sheets are valid for 7 calendar days. Prices are subject to copper and raw material index adjustments. GST invoices (under GSTIN 09AWTPT8270E1ZQ) are issued for all wholesale order files.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">3. Project Contracting & Site Delivery</h3>
              <p>
                Conduit laying, distribution board installations, and CCTV wiring require authorized technical site drawings. Site delivery is only initiated when the baseline advance payments are settled or verified by our accounting console.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">4. Governing Law</h3>
              <p>
                Any disputes arising from estimates, delivery timelines, or contracting installations shall be subject to the exclusive jurisdiction of the courts of Greater Noida, Uttar Pradesh, India.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
