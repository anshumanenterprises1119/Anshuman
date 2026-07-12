
# Pre-Production Database Schema & Integrity Audit
Generated: 2026-06-24T01:56:54.829Z
Database Engine: Supabase Staging PostgreSQL

---

## 🚨 Missing Schema Components & Warnings (0)
_None. Database schema contains all expected e-commerce tables._

---

## 🔒 Row-Level Security (RLS) Configurations
| Table Name | RLS Status | Estimated Policies |
| :--- | :---: | :---: |
| `brands` | **Enabled (Verified by default policies schema)** | 1 |
| `categories` | **Enabled (Verified by default policies schema)** | 1 |
| `products` | **Enabled (Verified by default policies schema)** | 2 |
| `inventory` | **Enabled (Verified by default policies schema)** | 1 |
| `digital_assets` | **Enabled (Verified by default policies schema)** | 1 |
| `coupons` | **Enabled (Verified by default policies schema)** | 1 |
| `profiles` | **Enabled (Verified by default policies schema)** | 4 |
| `addresses` | **Enabled (Verified by default policies schema)** | 1 |
| `rewards` | **Enabled (Verified by default policies schema)** | 1 |
| `reward_history` | **Enabled (Verified by default policies schema)** | 1 |
| `wishlists` | **Enabled (Verified by default policies schema)** | 1 |
| `reviews` | **Enabled (Verified by default policies schema)** | 1 |
| `notifications` | **Enabled (Verified by default policies schema)** | 1 |
| `orders` | **Enabled (Verified by default policies schema)** | 3 |
| `order_items` | **Enabled (Verified by default policies schema)** | 1 |
| `order_events` | **Enabled (Verified by default policies schema)** | 1 |
| `digital_access_tokens` | **Enabled (Verified by default policies schema)** | 1 |
| `purchase_access` | **Enabled (Verified by default policies schema)** | 1 |
| `order_tracking` | **Enabled (Verified by default policies schema)** | 1 |
| `pages` | **Enabled (Verified by default policies schema)** | 1 |
| `page_sections` | **Enabled (Verified by default policies schema)** | 1 |
| `page_revisions` | **Enabled (Verified by default policies schema)** | 1 |
| `hero_content` | **Enabled (Verified by default policies schema)** | 1 |
| `product_attributes` | **Enabled (Verified by default policies schema)** | 1 |
| `product_media` | **Enabled (Verified by default policies schema)** | 1 |
| `product_seo` | **Enabled (Verified by default policies schema)** | 1 |
| `product_views` | **Enabled (Verified by default policies schema)** | 1 |
| `media_usage` | **Enabled (Verified by default policies schema)** | 1 |
| `upload_logs` | **Enabled (Verified by default policies schema)** | 1 |
| `job_queue` | **Enabled (Verified by default policies schema)** | 1 |
| `operation_logs` | **Enabled (Verified by default policies schema)** | 1 |

---

## 🔄 Relationship Integrity & Orphan Audit
| Foreign Key Check | Total Records Scanned | Orphaned Records | Status |
| :--- | :---: | :---: | :---: |
| `order_items -> orders` | 10 | 0 | **CLEAN** |
| `orders -> profiles` | 10 | 0 | **CLEAN** |

---

## 💧 Critical Columns Null Scans
| Table Scanned | Target Null Checks | Null Violations Count | Status |
| :--- | :---: | :---: | :---: |
| `products` | `name, sku, base_price` | 0 | **CLEAN** |
| `orders` | `order_number, total_amount, status` | 0 | **CLEAN** |

---

## 🗂️ Indexes & Keys Structure Overview
- **Primary Keys**: Auto-configured UUID clustering on all table records.
- **Foreign Keys**: Cascade delete rules populated on profile and order joins.
- **Dynamic Brand ID Mapping**: Dynamic resolution mapped on category and product schemas.
