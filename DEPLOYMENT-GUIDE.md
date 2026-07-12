# Production Deployment & Hosting Guide

This guide describes how to deploy the upgraded Next.js and Supabase ecommerce system in a production environment (Vercel, Supabase, Cloudflare R2, and Appsmith) supporting up to 1000 users at low cost.

---

## 1. Hosting Next.js on Vercel

Vercel is the optimal hosting platform for Next.js, featuring global Edge routing, serverless function scaling, and a generous free tier.

### Step 1: Connect Codebase to Vercel
1.  Push your code (including the `ecommerce-platform/` subdirectory) to a private GitHub repository.
2.  Log in to [Vercel Dashboard](https://vercel.com) and click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  Configure Build Settings:
    *   **Root Directory**: Set this to `ecommerce-platform` (very important!).
    *   **Framework Preset**: Select `Next.js`.
    *   **Build Command**: `next build`
    *   **Output Directory**: `.next`

### Step 2: Environment Variables
Copy all keys from your local `.env.local` file and paste them under the **Environment Variables** section in the Vercel project configuration. Ensure you add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (this key stays secured on the Vercel server and is never exposed to browser clients).

### Step 3: Click Deploy
Vercel will compile the Next.js build and host your endpoints on a secure serverless environment.

---

## 2. Domain & Routing Configuration (Multi-Brand)

To support multiple storefronts on a single Next.js project deployment, we map distinct domains to Vercel and handle routing dynamically.

1.  **Add Domains in Vercel**:
    *   Go to Vercel -> Project -> **Settings** -> **Domains**.
    *   Add your domains:
        *   `anshumanenterprises.online`
        *   `futurewithai.online`
2.  **DNS Records**:
    *   Configure your domain registrar DNS records to point to Vercel's Edge server:
        *   **A Record**: Point `@` (root) to `76.76.21.21`.
        *   **CNAME Record**: Point `www` to `cname.vercel-dns.com`.
3.  **Dynamic Route Handling**:
    Next.js handles hostname mapping on request headers. An incoming request to `futurewithai.online` is routed to the `/futurewithai` page workspace, while `anshumanenterprises.online` is routed to `/anshuman-enterprises` to maintain separate storefronts.

---

## 3. Supabase Database Security & Optimizations

1.  **Enforce SSL**:
    In Supabase settings, ensure SSL enforcement is enabled. All transactions between Vercel, Appsmith, and Supabase are encrypted.
2.  **Limit Database Access**:
    Ensure the `service_role` key is never shared or loaded client-side. Set RLS policies on all tables so public clients cannot query or modify private orders, user details, and digital delivery tokens.
3.  **Connection Pooling**:
    When connecting Appsmith or external backend processes to Supabase, use the Transaction Pooler connection strings (Port `6543`) rather than direct connections (Port `5432`). This maintains database stability under concurrent request load (1000+ users).

---

## 4. Cloudflare R2 Storage Configurations

1.  **Set Up Custom Domain for Public Assets**:
    *   In the Cloudflare Dashboard, go to your R2 bucket `anshuman-assets`.
    *   Under **Settings** -> **Public Access**, bind a subdomain (e.g. `images.anshumanenterprises.online`). This provides direct, fast, and cache-backed delivery of product pictures.
2.  **Access Rules**:
    *   Ensure the `futurewithai-downloads` bucket remains private. Only generate pre-signed URLs from the Next.js `/api/download` endpoint, preventing users from sharing direct product download URLs.

---

## 5. Cost Optimization Strategies

*   **Vercel Hobby Plan (Free)**: Offers sufficient compute resources and edge bandwidth to support 1000+ users monthly.
*   **Supabase Free Tier**: Includes a 500 MB Postgres database, which can store approximately 100,000 orders and customer records before requiring a paid scale-up ($10-$25/month).
*   **Cloudflare R2 Free Tier**: Includes 10 GB of storage, 1 million Class A operations (writes/uploads), and 10 million Class B operations (reads/downloads) per month. For a 1000-user target, R2 costs will stay inside the **$0.00** limit.
*   **Fast2SMS SMS Plan**: SMS sends are charged on a per-use micro-payment structure (approx ₹0.20 per OTP), keeping initial maintenance overhead low.
