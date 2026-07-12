import { redirect } from 'next/navigation';
import React from 'react';

// In production, Next.js Middleware or Server Components check the request headers 
// (e.g., headers().get('host')) to determine which brand website to render.
// This allows both brands to share one Next.js project deployment.
export default async function HomePage() {
  // For demonstration / development fallback:
  // In a real environment, you'd match the domain:
  // e.g. "futurewithai.online" -> redirect("/futurewithai")
  // For now, redirect to selection page or default brand
  redirect('/anshuman-enterprises');
}
