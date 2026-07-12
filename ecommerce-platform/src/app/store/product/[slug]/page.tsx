'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/Button';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  type: 'physical' | 'digital';
  brand_id: string;
  slug: string;
  description: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  } | null;
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const productSlug = params.slug;
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    loadProductDetails();
  }, [productSlug]);

  // Log page view when product and user session are ready
  useEffect(() => {
    if (product) {
      supabase.from('product_views').insert({
        profile_id: user?.id || null,
        product_id: product.id,
      }).then(({ error }) => {
        if (error) console.error('Error logging page view:', error);
      });
    }
  }, [product, user]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch product
      const { data: prodData } = await supabase
        .from('products')
        .select('id, name, sku, base_price, type, brand_id, slug, description')
        .eq('slug', productSlug)
        .single();

      if (prodData) {
        const prod = prodData as Product;
        setProduct(prod);

        // 2. Fetch reviews
        const { data: revData } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            profiles (
              email,
              full_name
            )
          `)
          .eq('product_id', prod.id)
          .order('created_at', { ascending: false });
        
        if (revData) setReviews(revData as unknown as Review[]);

        // 3. Fetch related products (same type, max 3)
        const { data: relData } = await supabase
          .from('products')
          .select('id, name, sku, base_price, type, brand_id, slug')
          .eq('type', prod.type)
          .neq('id', prod.id)
          .limit(3);
        
        if (relData) setRelated(relData as Product[]);

        // 4. Fetch wishlist status if logged in
        if (user) {
          const { data: wishData } = await supabase
            .from('wishlists')
            .select('id')
            .eq('profile_id', user.id)
            .eq('product_id', prod.id)
            .maybeSingle();

          if (wishData) {
            setIsWishlisted(true);
            setWishlistId(wishData.id);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching product details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    try {
      if (isWishlisted && wishlistId) {
        const { error } = await supabase.from('wishlists').delete().eq('id', wishlistId);
        if (error) throw error;
        setIsWishlisted(false);
        setWishlistId(null);
      } else if (product) {
        const { data, error } = await supabase
          .from('wishlists')
          .insert({
            profile_id: user.id,
            product_id: product.id,
          })
          .select('id')
          .single();

        if (error) throw error;
        setIsWishlisted(true);
        setWishlistId(data.id);
      }
    } catch (err: any) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          profile_id: user.id,
          product_id: product.id,
          rating,
          comment: comment || null,
        });

      if (error) throw error;

      setComment('');
      setReviewSuccess('Review submitted successfully.');
      
      // Reload reviews
      const { data: revData } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles (
            email,
            full_name
          )
        `)
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });
      
      if (revData) setReviews(revData as unknown as Review[]);
    } catch (err: any) {
      console.error('Error saving review:', err);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-xs text-gray-400">Loading catalog sheet...</div>;
  }

  if (!product) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-xs text-red-500">Catalog item not found.</div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'N/A';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 animate-fade-in text-gray-800">
      
      {/* Product Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-0.5 rounded-[5px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black uppercase text-[8px] tracking-wider">
              {product.type}
            </span>
            <button
              onClick={handleToggleWishlist}
              className={`text-xs font-bold transition flex items-center gap-1.5 ${isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>{isWishlisted ? '❤️ Saved' : '🤍 Save Item'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-800 leading-snug">{product.name}</h1>
            <p className="text-[10px] text-gray-400 font-mono">SKU Model: {product.sku || 'N/A'}</p>
          </div>

          <div className="text-xs text-gray-600 leading-relaxed">
            {product.description || 'No product catalog specifications provided.'}
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-450 uppercase font-bold tracking-wider">Price (INR)</p>
              <p className="font-mono font-black text-gray-800 text-xl mt-1">₹{Number(product.base_price).toLocaleString()}</p>
            </div>
            <Button
              onClick={() => addToCart({ id: product.id, name: product.name, price: product.base_price, type: product.type, brandSlug: 'anshuman-enterprises' })}
              className="px-6 py-2.5 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-500 shadow-md"
            >
              Add To Cart
            </Button>
          </div>
        </div>

        {/* Mock Image Display */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-8 aspect-video md:aspect-auto">
          <div className="text-center space-y-2">
            <span className="text-4xl">⚙️</span>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Fulfillment Component Image</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Reviews Lists */}
        <div className="md:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-bold text-gray-800 text-sm">Customer Feedback</h3>
            <span className="text-xs font-bold text-gray-500">Average Rating: ★ {averageRating}</span>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No reviews submitted for this catalog item.</p>
          ) : (
            <div className="space-y-4 divide-y divide-gray-50">
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-4 text-xs space-y-2 first:pt-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-700">{rev.profiles?.full_name || rev.profiles?.email || 'Anonymous Buyer'}</p>
                    <div className="text-amber-500 text-sm font-bold">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                        <span key={i} className="text-gray-150">★</span>
                      ))}
                    </div>
                  </div>
                  {rev.comment && <p className="text-gray-600 italic">"{rev.comment}"</p>}
                  <p className="text-[9px] text-gray-400">Published {new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Panel */}
        <div>
          {user ? (
            <form onSubmit={handleSubmitReview} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Write Review</h3>
              {reviewSuccess && <p className="text-xs text-green-600 bg-green-50 p-2 border rounded-lg font-semibold">{reviewSuccess}</p>}
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Rating Scale</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-indigo-500"
                >
                  <option value={5}>★ 5 Stars (Excellent)</option>
                  <option value={4}>★ 4 Stars (Good)</option>
                  <option value={3}>★ 3 Stars (Average)</option>
                  <option value={2}>★ 2 Stars (Fair)</option>
                  <option value={1}>★ 1 Star (Poor)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Your Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts about this item..."
                  className="w-full p-3 border border-gray-200 text-xs outline-none focus:border-indigo-500 rounded-lg text-gray-800"
                  required
                />
              </div>

              <Button type="submit" fullWidth className="text-xs py-2 rounded-lg text-white">Submit Review</Button>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-100 border-dashed p-6 rounded-2xl text-center text-xs text-gray-500">
              Please <a href="/login" className="font-bold text-indigo-600 hover:underline">login</a> to write a review for this catalog product.
            </div>
          )}
        </div>
      </div>

      {/* Related Products shelf */}
      {related.length > 0 && (
        <div className="space-y-6 pt-4 border-t">
          <h3 className="font-bold text-gray-850 text-base">Customers Also Viewed</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div key={rel.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
                <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">{rel.type}</span>
                  <a href={`/store/product/${rel.slug}`} className="block font-bold text-gray-800 hover:underline leading-snug">{rel.name}</a>
                  <p className="text-[10px] text-gray-400 font-mono">Ref: {rel.sku || 'N/A'}</p>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                  <span className="font-mono font-bold text-gray-800 text-xs">₹{Number(rel.base_price).toLocaleString()}</span>
                  <a href={`/store/product/${rel.slug}`} className="text-[10px] text-indigo-600 font-bold hover:underline">View Specs</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
