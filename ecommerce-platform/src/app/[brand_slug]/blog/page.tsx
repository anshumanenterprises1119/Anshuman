'use client';

import React, { useEffect } from 'react';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
}

const BRAND_POSTS: Record<string, BlogPost[]> = {
  'anshuman-enterprises': [
    {
      title: 'Residential Electrical Safety: The Ultimate Contractor Guide',
      excerpt: 'Electrical failure is a leading cause of domestic accidents in Greater Noida. Learn how Polycab fire-retardant wires and double-insulated conduits protect your building from overheating.',
      date: 'June 15, 2026',
      author: 'Anshuman Tiwari',
      readTime: '6 min read',
      category: 'Safety',
      tags: ['Wiring', 'Polycab', 'Safety Check']
    },
    {
      title: 'Designing Distribution Boards for Commercial Spaces',
      excerpt: 'Industrial electrical setups require structural planning. We break down the mapping of Cona dual-door MCB boards, selector switches, and load balancing across busbars for balanced phases.',
      date: 'May 28, 2026',
      author: 'Technical Team',
      readTime: '8 min read',
      category: 'Engineering',
      tags: ['MCB Box', 'Cona Switches', 'Phase Balancer']
    },
    {
      title: 'Deploying IP CCTV Surveillance Grids for Housing Societies',
      excerpt: 'Security is paramount. Discover how to plan structured Cat6 network racks, DVR storage vaults, and camera location mapping to eliminate blind spots in multi-story apartments.',
      date: 'May 10, 2026',
      author: 'Surveillance Desk',
      readTime: '10 min read',
      category: 'Security',
      tags: ['CCTV DVR', 'Cat6 Cables', 'Society Grid']
    }
  ],
  'futurewithai': [
    {
      title: 'How to Self-Host n8n for Zero Monthly Cost',
      excerpt: 'Tired of paying for Zapier limits? Self-host n8n using Docker or Render. We walk you through configuring webhook endpoints, webhook loops, and local databases.',
      date: 'June 20, 2026',
      author: 'Automation Architect',
      readTime: '7 min read',
      category: 'n8n Workflows',
      tags: ['n8n Self-Host', 'Docker', 'Webhooks']
    },
    {
      title: 'Instagram Reels Mastery: Transitions and Hook Presets',
      excerpt: 'Hook users in under 3 seconds. Learn to combine visual assets, motion graphic presets, audio overlay beats, and text captions to skyrocket IG and YouTube reach.',
      date: 'June 05, 2026',
      author: 'Creative Designer',
      readTime: '5 min read',
      category: 'Reels Assets',
      tags: ['Reels Bundle', 'Video Editing', 'Premiere Pro']
    },
    {
      title: 'Synergizing Google Apps Script with Payment Webhooks',
      excerpt: 'Build a secure, automated digital delivery pipeline. Step-by-step logic detailing how to parse raw PhonePe webhook payloads and triggers via Google Sheet databases.',
      date: 'May 17, 2026',
      author: 'Lead Developer',
      readTime: '9 min read',
      category: 'Integrations',
      tags: ['Apps Script', 'Payment Webhook', 'Google Sheets']
    }
  ]
};

export default function BlogListingPage({ params }: { params: { brand_slug: string } }) {
  const brandSlug = params.brand_slug;
  const posts = BRAND_POSTS[brandSlug] || [];

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandSlug);
  }, [brandSlug]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {brandSlug === 'futurewithai' ? '⚡ FutureWithAI Insights Portal' : 'Contractor Chronicles & Guides'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {brandSlug === 'futurewithai'
            ? 'Articles and tutorials on digital automation, workflow designs, video editing assets, and SaaS scaling.'
            : 'Insights from Greater Noida electrical projects, bulk material planning guides, safety audits, and installation logs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <div key={idx} className="glass-card flex flex-col justify-between border hover:border-[var(--primary-color)] transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wider">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h4 className="font-extrabold text-base leading-snug text-[var(--text-primary)] hover:text-[var(--primary-color)] cursor-pointer">
                {post.title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 bg-gray-50 border rounded text-gray-500">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>By {post.author}</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
