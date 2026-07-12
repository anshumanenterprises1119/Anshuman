
# User Acceptance Testing (UAT) Verification Matrix

Generated: 2026-06-24T01:55:59.941Z
Testing Framework: Automated Staging Runner
Staging Launch Status: **DEGRADED (YELLOW)**

---

## 1. 👥 Guest Flow Matrix
| Test Flow Step | Status | Latency | Result Details |
| :--- | :---: | :---: | :--- |
| Catalog Fetch | **SUCCESS** | 395ms | Loaded 5 products. Sample: Modular Lighting Distribution Board |
| Product Search & Suggestion | **SUCCESS** | 200ms | Search query "COB" matched product: "Premium COB Ceiling Light 12W" |
| View FAQ CMS Content | **SUCCESS** | 465ms | Loaded FAQs via CMS content table fallback. Status: OK |

---

## 2. 👤 Registered Customer Flow Matrix
| Test Flow Step | Status | Latency | Result Details |
| :--- | :---: | :---: | :--- |
| Authentication Check | **SUCCESS** | 211ms | Verified user account seed_customer_1@gmail.com (ID: ee271362-2f16-4942-886e-cdeed9b6c9c3) |
| View Profile & Reward Details | **SUCCESS** | 208ms | Profile email verified: seed_customer_1@gmail.com. Role: customer |
| Wishlist Management | **FAILED** | 199ms | Could not find the table 'public.wishlists' in the schema cache |
| Order Tracking Verification | **SUCCESS** | 214ms | Order: SEED-ORD-20260001. Status: pending. Waybill: Pending |
| Notifications Fetching | **SUCCESS** | 208ms | Unread notifications count: 1 |

---

## 3. 🧠 FutureWithAI Digital Customer Flow Matrix
| Test Flow Step | Status | Latency | Result Details |
| :--- | :---: | :---: | :--- |
| User Token Verification | **SUCCESS** | 210ms | Verified digital buyer account: seed_customer_2@gmail.com |
| Secure Digital Assets Access | **FAILED** | 201ms | Could not find the table 'public.purchase_access' in the schema cache |
| Secure Token Downloads Delivery | **SUCCESS** | 202ms | Token: seed_token_jwt_... Download count: 0/10 |

---

## 4. 🔑 Administrator Panel Operations Matrix
| Test Flow Step | Status | Latency | Result Details |
| :--- | :---: | :---: | :--- |
| Admin Profile Authorization | **FAILED** | 396ms | Profile role 'customer' is not admin/staff |
| Analytics Funnel Data | **FAILED** | 196ms | Could not find the table 'public.product_views' in the schema cache |
| CMS Page Layout Management | **FAILED** | 201ms | Could not find the table 'public.pages' in the schema cache |
| Operations Timeline Audits | **FAILED** | 199ms | Could not find the table 'public.operation_logs' in the schema cache |

---
_All operations and validation checks executed against live staging Supabase environment variables._
