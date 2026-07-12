
# Pre-Production Database Seeding Report

Generated: 2026-06-24T01:55:17.661Z
Target Connection: Supabase Staging Database

## Seeding Summary Metrics
- **Auth Accounts Created**: 10 Customers (seeded_customer_*@gmail.com)
- **Active Products Upserted**: 20 Products (10 Physical, 10 Digital)
- **Staging Orders Recorded**: 10 Complex Orders
- **Staging Coupons Seeded**: 4 Promo Codes
- **Wishlist Items Mapped**: 0
- **Product Reviews Logged**: 0
- **Stored Notifications**: 10

---

## 🚨 Seeding Integrity Alerts & Warnings (3)
> [!WARNING]
> **Column "level" is missing from the database profiles table schema cache.**

> [!WARNING]
> **Table "wishlists" is missing from database schema cache.**

> [!WARNING]
> **Table "order_events" is missing from the database. Order status logs and idempotency checks will be skipped until migrations are applied.**

---

## 👥 Seeded Staging Customer Accounts
| User ID | Email Login | Name | Loyalty Level | Initial Points | Default Password |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `ee271362-2f16-4942-886e-cdeed9b6c9c3` | `seed_customer_1@gmail.com` | Anshul Sharma | `default` | 250 | `Password123!` |
| `03202b0b-8ca7-4bfe-86db-bc557413b904` | `seed_customer_2@gmail.com` | Priya Patel | `default` | 500 | `Password123!` |
| `887d8e53-5290-4c56-ace1-0b684251b864` | `seed_customer_3@gmail.com` | Rahul Verma | `default` | 750 | `Password123!` |
| `38f940cd-814e-4c1a-b0af-02bb4c4f592e` | `seed_customer_4@gmail.com` | Sneha Reddy | `default` | 1000 | `Password123!` |
| `4e81a032-5ad3-4eb4-b9f6-5665a5e94fec` | `seed_customer_5@gmail.com` | Amit Mishra | `default` | 1250 | `Password123!` |
| `964452cf-d1fa-4d4a-b9cf-8817ad937a2b` | `seed_customer_6@gmail.com` | Neha Gupta | `default` | 1500 | `Password123!` |
| `61c06951-fe68-42f5-813a-aa34f0a7704c` | `seed_customer_7@gmail.com` | Vikram Singh | `default` | 1750 | `Password123!` |
| `93956439-01a9-4eb7-8ed8-ddfc947cbb42` | `seed_customer_8@gmail.com` | Kavita Joshi | `default` | 2000 | `Password123!` |
| `e3ea5eaf-f0a4-4c32-bfae-c203a19c1565` | `seed_customer_9@gmail.com` | Sanjay Kumar | `default` | 2250 | `Password123!` |
| `fac57ce1-487f-4360-9a17-08d107cd03f1` | `seed_customer_10@gmail.com` | Ritu Saxena | `default` | 2500 | `Password123!` |

---

## 🛍️ Active Products Seeding Log
| Product ID | Name | Base Price | Delivery Type |
| :--- | :--- | :---: | :---: |
| `e101b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Premium COB Ceiling Light 12W | ₹1200 | `physical` |
| `e102b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Polycab FR House Wire 1.5 sq mm | ₹1800 | `physical` |
| `e103b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | KEI FRLS House Wire 2.5 sq mm | ₹2800 | `physical` |
| `e104b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Havells Crabtree Modular Switch (Graphite) | ₹120 | `physical` |
| `e105b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Legrand Myrius 6A 2-Way Switch | ₹150 | `physical` |
| `e106b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Orient LED Batten Lamp 20W | ₹350 | `physical` |
| `e107b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | CP Plus HD Dome Camera 2MP | ₹1850 | `physical` |
| `e108b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Schneider Acti9 16A SP MCB | ₹450 | `physical` |
| `e109b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | PVC Conduit Pipe 25mm (Medium) | ₹60 | `physical` |
| `e110b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Fingerprint Smart Door Lock (CONA) | ₹12500 | `physical` |
| `e201b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Ultimate n8n AI Automation Pack | ₹349 | `digital` |
| `e202b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | 400+ PHP Manually Tested Scripts | ₹499 | `digital` |
| `e203b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Ultimate Web Applications Bundle | ₹999 | `digital` |
| `e204b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Emergent Prompt Engineering Blueprint | ₹199 | `digital` |
| `e205b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | NodeJS SaaS Boilerplate & Auth Template | ₹799 | `digital` |
| `e206b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Python Autonomous Agent Scraper Suite | ₹399 | `digital` |
| `e207b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | Next.js Portfolio Tailwind Theme | ₹299 | `digital` |
| `e208b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | WordPress WooCommerce Automation Plugin | ₹599 | `digital` |
| `e209b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | n8n Lead Generation Pipeline Template | ₹249 | `digital` |
| `e210b1c6-2c5e-4029-9a2e-c1e1bc89a74a` | PHP Database backup Automation Script | ₹149 | `digital` |

---

## 💳 Seeded Transaction Orders Logs
| Order ID | Order Number | Total Amount | Order Status | Delivery Type |
| :--- | :--- | :---: | :---: | :---: |
| `1273e4f9-e7f1-4044-80dc-044fb1cc1d89` | `SEED-ORD-20260001` | ₹2950 | `pending` | `physical` |
| `fac8c748-1000-4311-9830-8290277df295` | `SEED-ORD-20260002` | ₹150 | `processing` | `digital` |
| `b57a6ae5-e297-4a87-a150-d59794209ade` | `SEED-ORD-20260003` | ₹1950 | `shipped` | `physical` |
| `ef180542-bf74-40af-93f8-21484ff674c8` | `SEED-ORD-20260004` | ₹60 | `delivered` | `digital` |
| `b3edfc30-2414-43cf-b7ae-427887839417` | `SEED-ORD-20260005` | ₹499 | `cancelled` | `physical` |
| `54506f3a-65e0-48be-af06-48fefd5220cc` | `SEED-ORD-20260006` | ₹949 | `pending` | `digital` |
| `552b6833-5e72-4a33-9743-b89b718f65f5` | `SEED-ORD-20260007` | ₹949 | `processing` | `physical` |
| `016c31d4-6a29-40b4-ba05-3670a30df403` | `SEED-ORD-20260008` | ₹299 | `shipped` | `digital` |
| `98b00817-2e0e-4e0a-b698-6f8f1561155e` | `SEED-ORD-20260009` | ₹349 | `delivered` | `physical` |
| `53683828-8e65-4b25-af71-8087d45784ec` | `SEED-ORD-20260010` | ₹1200 | `cancelled` | `digital` |

---

## 🏷️ Seeded Active Coupons
| Coupon ID | Promo Code | Discount Type | Value |
| :--- | :--- | :---: | :---: |
| `03d352a4-447d-4063-b7af-77ff3a023b33` | `SEED-AE10` | Percentage | 10%/20% |
| `883e8f10-cf4c-4945-bbd6-919a4cc9dd7c` | `SEED-AEFIXED` | Fixed Amount | ₹200/₹50 |
| `cbb08b63-ae47-44c0-8458-738d10f3fc07` | `SEED-FWAI20` | Percentage | 10%/20% |
| `ced2b55a-3c85-489e-978e-4988a604316d` | `SEED-FWAIFIXED` | Fixed Amount | ₹200/₹50 |

---
_Verify RLS controls and constraints mapping against these IDs during UAT._
