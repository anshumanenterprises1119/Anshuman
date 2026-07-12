
# Pre-Production Route & SEO Crawl Audit
Generated: 2026-06-24T01:56:27.204Z
Target Environment: Next.js Compiled Staging Application

---

## 🚨 Broken Assets Summary
_No broken static assets detected in route codebases._

---

## 🧭 Routes SEO & Permission Mapping Matrix
| Page Route | File Entry | Required Role | Redirect Rules | SEO Status | SEO Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/account/downloads` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/admin/analytics` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/cms` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/content` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/dashboard` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/login` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/operations` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/orders` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/products` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/admin/users` | `page.tsx` | **Admin / Staff** | Redirects unauthenticated or non-admin users to /admin/login | ❌ Missing Title / Description | _Missing_ |
| `/anshuman-enterprises/modular-switches` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/auth/send-otp` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/auth/verify-otp` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/checkout` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/diagnose` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/download/:token` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/health` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/tracking/:carrier/:number` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/webhook/phonepe` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/api/webhook/shiprocket` | `route.ts` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/cart` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/checkout` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/futurewithai/library` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/futurewithai/n8n-pack` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/futurewithai` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/futurewithai/products` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/` | `layout.tsx` | **Guest** | None | ✅ Title: "Multi-Brand E-Commerce Platform" | "Scalable and low cost multi-brand e-commerce site ..." |
| `/login` | `page.tsx` | **Guest** | Redirects already authenticated customers to /profile | ❌ Missing Title / Description | _Missing_ |
| `/` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/profile/orders` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/profile` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/profile/reviews` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/profile/settings` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/profile/tracking` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/profile/wishlist` | `page.tsx` | **Customer** | Redirects unauthenticated or non-customer users to /login | ❌ Missing Title / Description | _Missing_ |
| `/store/category/:slug` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/store` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/store/product/:slug` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/blog` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/cart` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/catalog` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/checkout` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/dashboard` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/faq` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/login` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/privacy` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/product/:slug` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/return-policy` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/signup` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/:brand_slug/terms` | `page.tsx` | **Guest** | None | ❌ Missing Title / Description | _Missing_ |
| `/admin` | `Middleware Rule` | **Guest -> Redirects to Admin** | 302 Temporary Redirect to /admin/dashboard | N/A (Redirect Page) | _N/A_ |

---
### 🛠️ Crawler Verification Notes:
- Static assets under `/public` and root `*.webp` were audited.
- SEO Meta definitions were parsed using static code extraction.
- Middlewares path security was cross-referenced with `src/middleware.ts`.
