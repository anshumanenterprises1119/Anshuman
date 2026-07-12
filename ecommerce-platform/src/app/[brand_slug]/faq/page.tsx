'use client';

import React, { useState, useEffect } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

const BRAND_FAQS: Record<string, Record<string, FAQItem[]>> = {
  'anshuman-enterprises': {
    'General Services': [
      { q: 'What does Anshuman Enterprises do?', a: 'Anshuman Enterprises is a project electrical supply and contracting company. We provide branded electrical materials, residential/commercial wiring contracting, interior lighting designs, and CCTV security installations across Greater Noida and Delhi NCR.' },
      { q: 'Where are you located and which areas do you serve?', a: 'We operate from Greater Noida West and actively serve Noida, Greater Noida, Ghaziabad, Delhi, Gurugram, and other Delhi NCR regions.' },
      { q: 'Do you provide project quotation estimates?', a: 'Yes, we provide wholesale product quotations and project services cost estimates. You can submit your requirements via our contact forms or WhatsApp.' }
    ],
    'Electrical Materials': [
      { q: 'What brands of electrical products do you supply?', a: 'We deal only in genuine branded materials. Our primary partners include Polycab, Havells, Crabtree, RR Kabel, Cona, Anchor, GM, AKG, and Schneider.' },
      { q: 'Do you offer bulk delivery support?', a: 'Yes, we specialize in project-based bulk supply for builders, contractors, and corporate projects with direct delivery to construction sites.' }
    ],
    'Installation & Warranty': [
      { q: 'Do you provide services warranty?', a: 'All our installation work comes with a 1-year service warranty, in addition to standard manufacturer warranties on the branded materials supplied.' },
      { q: 'Can you handle industrial electrical planning?', a: 'Yes, our certified technicians carry years of contracting experience to design and deploy industrial switchgear boards, wire grids, and structured network rack cables.' }
    ]
  },
  'futurewithai': {
    'Digital Downloads': [
      { q: 'How do I receive my purchased digital assets?', a: 'Immediately after purchase checkout (or payment confirmation for UPI), download keys will be provisioned in your Customer Dashboard. You will also receive an email with direct download tokens.' },
      { q: 'Is there a limit on file downloads?', a: 'Yes, for security, files are capped at 10 downloads per token and keys expire after 30 days. If your token expires and you need access again, contact our support desk.' },
      { q: 'Are these templates editable?', a: 'Absolutely. The video editing packs, reels templates, and n8n workflow JSONs are fully customizable to fit your business workflows.' }
    ],
    'Automation Workflows': [
      { q: 'What is included in the n8n automation pack?', a: 'It includes 40+ pre-built, manually tested workflows for connecting Google Sheets, WhatsApp Business APIs, Gmail triggers, and CRM lead routers.' },
      { q: 'Do I need a paid n8n subscription to run these?', a: 'No, you can host n8n for free on your own local server, or run them on free hosting tiers like Render, Railway, or standard Appsmith clouds.' }
    ],
    'Refund Policy': [
      { q: 'What is your refund policy?', a: 'Due to the nature of digital products, we generally do not offer refunds once files are downloaded. However, if a workflow is broken and cannot be resolved by support, we issue a full refund within 7 days of purchase.' }
    ]
  }
};

export default function FAQPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const categories = BRAND_FAQS[brandSlug] || {};
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
  }, [brandSlug]);

  const toggleFAQ = (cat: string, index: number) => {
    const key = `${cat}-${index}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {brandSlug === 'futurewithai' ? 'Automation & Files FAQ' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          {brandSlug === 'futurewithai' 
            ? 'Got questions about downloads, automation licenses, or payment processing? We have answers.'
            : 'Find answers about our bulk electrical supplies, installation projects, warranties, and NCR delivery times.'}
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(categories).map(([categoryName, items]) => (
          <div key={categoryName} className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-[var(--primary-color)]">
              {categoryName}
            </h3>
            
            <div className="space-y-3">
              {items.map((item, idx) => {
                const isOpen = openIndex === `${categoryName}-${idx}`;
                return (
                  <div 
                    key={idx} 
                    className={`glass-card p-0 overflow-hidden border transition ${
                      isOpen ? 'border-[var(--primary-color)] shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(categoryName, idx)}
                      className="w-full text-left px-6 py-4 font-bold flex justify-between items-center text-sm md:text-base text-[var(--text-primary)] hover:bg-gray-50/50"
                    >
                      <span>{item.q}</span>
                      <span className="text-xl text-[var(--primary-color)] font-mono transition-transform duration-200">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-60 border-t' : 'max-h-0'
                      }`}
                    >
                      <p className="px-6 py-4 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed bg-white">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card text-center py-8 space-y-4 bg-gray-50/50">
        <h4 className="font-bold text-lg">Still have questions?</h4>
        <p className="text-xs text-[var(--text-secondary)]">Our support team is active 24/7 to solve your inquiries.</p>
        <div className="flex justify-center gap-4">
          <a href={`/${brandSlug}/dashboard`} className="btn btn-primary text-xs py-2">Open Support Ticket</a>
          <a href="https://wa.me/917065815743" className="btn btn-secondary text-xs py-2" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp Live Help
          </a>
        </div>
      </div>
    </div>
  );
}
