'use client';

import React, { useEffect } from 'react';

export default function PrivacyPolicyPage({ params }: { params: { brand_slug: string } }) {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: June 24, 2026
          </p>
        </div>

        {isFuture ? (
          // FutureWithAi Digital Privacy Policy
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            <p>
              At <strong>FutureWithAi</strong>, we prioritize the protection and confidentiality of your personal and professional data. This Privacy Policy outlines how we handle data for our digital storefront and secure download vault library.
            </p>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">1. Information Collection</h3>
              <p>
                We collect your email, name, and payment verification details when registering or purchasing digital items. To prevent license piracy and unauthorized account sharing, our secure vault at <code>/account/downloads</code> records client IP addresses, browser user-agents, and download timestamps upon file stream requests.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">2. Usage of Digital Assets Data</h3>
              <p>
                Your registration records are used solely to deliver software licenses, update n8n automation bundles, and dispatch reward notifications. We do not sell, rent, or distribute your email profile to external marketers.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">3. Cryptographic Storage & RLS</h3>
              <p>
                All digital purchase mappings are secured via PostgreSQL Row Level Security (RLS) tables. Download tokens expire automatically after 24 hours to prevent unauthorized access.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">4. Support & Contact</h3>
              <p>
                For data access requests or deletion parameters, please email our security officer at: 
                <a href="mailto:support@futurewithai.online" className="text-[var(--primary-color)] ml-1 font-semibold hover:underline">support@futurewithai.online</a>.
              </p>
            </div>
          </div>
        ) : (
          // Anshuman Enterprises Physical Privacy Policy
          <div className="space-y-6 text-sm leading-relaxed text-gray-650">
            <p>
              This Privacy Policy describes how <strong>Anshuman Enterprises</strong> collects, uses, stores, and protects your personal data through our platform and Greater Noida store.
            </p>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">1. Collection of Information</h3>
              <p>
                We collect personal data when you use our platform, including your name, shipping address, telephone number, email ID, and GSTIN registration parameters for wholesale ordering. Payment instruments (credit/debit card, UPI routing) are collected securely via licensed payment gateways.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">2. Usage of Personal Data</h3>
              <p>
                Your data is utilized to fulfill physical hardware shipments, prepare commercial project estimates, troubleshoot supply operations, and notify you of low-stock thresholds or new brand catalog releases.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">3. Security Precautions</h3>
              <p>
                We follow industry-standard security guidelines to safeguard your transaction logs. We advise all wholesale contractors to protect their profile login records and never share OTP tokens or net banking passwords with individuals claiming to represent our brand.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 space-y-2 text-xs">
              <h4 className="font-bold text-[#4d1017]">Grievance Officer & Contact details:</h4>
              <p>📍 Shop No.-2, KHS-722, Near Adityanandan Hospital, J S Roop Road, Aimnabad, Greater Noida - 201306</p>
              <p>📞 Phone: +91 70658 15743</p>
              <p>✉ Email: <a href="mailto:anshumanenterprises1119@gmail.com" className="font-semibold text-[var(--primary-color)] hover:underline">anshumanenterprises1119@gmail.com</a></p>
              <p><strong>GSTIN Ref:</strong> 09AWTPT8270E1ZQ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
