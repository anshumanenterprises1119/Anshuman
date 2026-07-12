# Multi-Brand E-Commerce Platform - Manual Review Packet

This manual review packet contains a comprehensive catalog of pages, administrative consoles, and dynamic brand portals configured in the Multi-Brand E-Commerce Platform.

---

## 🌐 Brand Storefronts

### 1. Anshuman Enterprises Staging Hub
- **Description**: Staging storefront featuring hardware products, LED lighting catalog, modular switches, and CCTV installations.
- **Route**: [anshuman-enterprises](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/anshuman-enterprises/page.tsx)
- **Key Features**: Product search, brand assets header, catalog filtering, return policies, and checkout gateways.

### 2. FutureWithAI Digital Portal
- **Description**: Staging storefront featuring digital automation packs (n8n, Python agents, WooCommerce automation plugins).
- **Route**: [futurewithai](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/futurewithai/page.tsx)
- **Key Features**: Digital product catalog, library downloads preview, token verification interfaces.

---

## 🛒 Storefront & Catalog Routes

| Page Reference | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Main Store Catalog** | [/store](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/store/page.tsx) | Guest | Shared catalog displaying products from both brands with unified search. |
| **Category View** | [/store/category/[slug]](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/store/category/[slug]/page.tsx) | Guest | Category-filtered grid displaying products matching active slugs. |
| **Product Detail** | [/store/product/[slug]](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/store/product/[slug]/page.tsx) | Guest | Comprehensive specifications sheet, ratings, attributes selector, and related products. |
| **Shopping Cart** | [/cart](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/cart/page.tsx) | Guest | Unified items aggregator supporting both physical and digital items. |
| **Checkout Gateway** | [/checkout](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/checkout/page.tsx) | Guest | Multi-mode checkout supporting Card, UPI, and COD transactions. |

---

## 👤 Registered Customer Account Profiles

| Page Reference | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Account Overview** | [/profile](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/page.tsx) | Customer | Customer dashboard featuring rewards tier status and points balance. |
| **Order History** | [/profile/orders](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/orders/page.tsx) | Customer | History list tracking past purchases, invoices, and payment tokens. |
| **Order Tracking** | [/profile/tracking](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/tracking/page.tsx) | Customer | Tracking logs showing carrier updates and Shiprocket integration. |
| **Review History** | [/profile/reviews](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/reviews/page.tsx) | Customer | User feedback history showing submitted reviews and ratings. |
| **Wishlist** | [/profile/wishlist](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/wishlist/page.tsx) | Customer | Saved items list with quick add-to-cart triggers. |
| **Settings** | [/profile/settings](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/profile/settings/page.tsx) | Customer | Manage address books, details, and default passwords. |

---

## 🔑 Administrative Operations Consoles

| Page Reference | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Admin Login** | [/admin/login](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/login/page.tsx) | Guest | Dual-session authentication form guarding admin scopes. |
| **Dashboard** | [/admin/dashboard](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/dashboard/page.tsx) | Admin / Staff | Administrative statistics panels showing revenue and orders volume. |
| **Products CMS** | [/admin/products](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/products/page.tsx) | Admin / Staff | Inventory warnings tracker, CSV import/export triggers, and metadata adjustments. |
| **Orders Operations** | [/admin/orders](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/orders/page.tsx) | Admin / Staff | Operational command center for order statuses, tracking numbers, and manual overrides. |
| **CMS Page Builder** | [/admin/cms](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/cms/page.tsx) | Admin / Staff | Homepage drag-and-drop editor, hero assets, category layouts, FAQs, and drafts. |
| **Content Library** | [/admin/content](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/content/page.tsx) | Admin / Staff | Brand assets manager, hero assets version control, media library, and FAQ builders. |
| **Analytics Funnel** | [/admin/analytics](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/analytics/page.tsx) | Admin / Staff | Telemetry logs viewer, product views trackers, and conversion funnel analytics. |
| **Timeline Audits** | [/admin/operations](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/operations/page.tsx) | Admin / Staff | Trace log entries for checkout lockups, webhook requests, and retry delays. |
| **Users Console** | [/admin/users](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/admin/users/page.tsx) | Admin / Staff | Admin management list of customer profiles and authentication records. |

---

## 🧠 FutureWithAI Digital Delivery

| Page Reference | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Digital Library** | [/futurewithai/library](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/futurewithai/library/page.tsx) | Customer | Digital library lists downloadable ZIP assets matching active tokens. |
| **Automation Center** | [/futurewithai/n8n-pack](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/futurewithai/n8n-pack/page.tsx) | Customer | Preview workflows, active loop definitions, and credentials templates. |
| **Digital Catalog** | [/futurewithai/products](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/ecommerce-platform/src/app/futurewithai/products/page.tsx) | Guest | Filtered showcase for FutureWithAI templates and SaaS boilerplates. |

---
_Dynamic routing logic and session protections are validated using automated crawler test scripts._
