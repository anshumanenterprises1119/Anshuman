'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  products: {
    name: string;
  } | null;
}

interface Product {
  id: string;
  name: string;
}

export default function CustomerReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadReviewData();
    }
  }, [user]);

  const loadReviewData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // 1. Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          products (
            name
          )
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData as unknown as Review[]);

      // 2. Fetch products for dropdown selection
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true);
      
      if (productsData) {
        setProducts(productsData as Product[]);
        if (productsData.length > 0) {
          setSelectedProductId(productsData[0].id);
        }
      }

    } catch (err) {
      console.error('Error loading reviews database content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProductId) return;

    setFormError('');
    setFormSuccess('');

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          profile_id: user.id,
          product_id: selectedProductId,
          rating: Number(rating),
          comment: comment || null,
        });

      if (error) throw error;

      setComment('');
      setFormSuccess('Thank you! Your product review has been submitted successfully.');
      loadReviewData();
    } catch (err: any) {
      console.error('Error creating product review:', err);
      setFormError(err.message || 'Failed to submit review.');
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-400">Syncing reviews data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Product Reviews</h1>
        <p className="text-xs text-gray-500 mt-1">Share feedback about products you purchased or managed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Submitted Reviews History */}
        <div className="md:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Your Review History</h2>
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No reviews submitted yet.</p>
          ) : (
            <div className="space-y-4 text-xs">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-gray-50 bg-gray-50/50 p-4 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800">{rev.products?.name || 'Deliverable Item'}</p>
                    <div className="flex text-amber-500 font-bold text-sm">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                        <span key={i} className="text-gray-200">★</span>
                      ))}
                    </div>
                  </div>
                  {rev.comment && <p className="text-gray-600 leading-normal italic">"{rev.comment}"</p>}
                  <p className="text-[9px] text-gray-400">Reviewed on {new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compose Review Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-gray-700">Write a Review</h2>
          
          {formError && <p className="text-xs text-red-500 font-semibold">{formError}</p>}
          {formSuccess && <p className="text-xs text-green-600 font-semibold bg-green-50 p-2.5 border border-green-100 rounded-xl leading-normal">{formSuccess}</p>}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Choose Catalog Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[var(--primary-color)] text-gray-800"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Rating Scale</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[var(--primary-color)] text-gray-800"
            >
              <option value={5}>5 Stars - Excellent Quality</option>
              <option value={4}>4 Stars - Good Quality</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Comments & Review Details</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share details of your experience..."
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[var(--primary-color)] text-gray-850"
            />
          </div>

          <Button type="submit" fullWidth className="py-2 rounded-lg text-xs font-bold text-white shadow-md">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
