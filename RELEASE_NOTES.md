# Phase 6 Release Notes, Rollback Guides & Deployment Checklist

This document details the software release, database migration logs, rollback procedures, and final checks required to launch the hardened Multi-Brand E-Commerce Platform live.

---

## 1. Release Notes (Phase 6 Hardening)
This pre-production hardening release transitions the application from a simulation state to live-ready operational stability.
### Major Enhancements:
- **Environment Isolation**: Separate staging environments (`.env.development`, `.env.staging`, `.env.production`) to isolate URLs, database hosts, cookies, and payment merchant keys.
- **Real Data Integrity**: Enabled real database mode for storefront and catalog routes, bypassing local mock lists when `NEXT_PUBLIC_APP_ENV` is set to `'production'`.
- **Integrity Diagnostic Tool**: Added a database scanner in `src/lib/db/diagnose.ts` to audit catalog assets, SEO tags, and relation mismatches, accessible via `/api/diagnose` or the Operations panel.
- **Upload Engine Hardening**: Added brand-level storage quota enforcement (50MB cap), simulated WebP compression (40% space reduction), version conflicts prevention, and deletion protection linked to component reference tracks.
- **Order Reliability Loops**: Implemented row-level locks on checkouts, uniqueness check of idempotency UUIDs, and a background task retry queue (`job_queue`) using exponential backoff with automatic Dead Letter Queue (DLQ) routing.
- **Observability System**: Centralized logging in `logger.ts` for requests, errors, performance metrics, and business activities.
- **Security Protections**: Injected standard HTTP security headers to outgoing middleware flows, and added API rate limits (60 req/min).

---

## 2. Migration Logs
The following PostgreSQL migrations must be applied to the target database in chronological order:
1. `20260623000000_init_schema.sql` (Initial brands, products, profiles, categories, orders tables).
2. `20260623000001_create_support_table.sql` (Support queries and contact mappings).
3. `20260623000002_fix_rls_recursion.sql` (RLS policy check fixes).
4. `20260623000003_customer_features.sql` (Customer wishlists, reviews, reviews tracking).
5. `20260623000004_phase3_tables.sql` (CMS pages, page sections, revisions, persistent carts, checkout sessions).
6. `20260623000005_phase4_tables.sql` (Product attributes, galleries, licenses, rewards, search history, operation logs).
7. `20260623000006_seed_production_data.sql` (Initial catalog seeding).
8. `20260623000007_phase6_tables.sql` (**Latest**: media usage, upload logs, order events, job retry queues, and row locking database functions).

---

## 3. Rollback Procedures
In the event of critical staging failures or database errors during deployment, execute the following commands.

### A. Reverting Phase 6 Database Migrations:
Run these commands in the Supabase SQL editor or migration terminal:
```sql
-- 1. Drop database functions
drop function if exists public.lock_order_row(uuid);
drop function if exists public.is_admin_or_staff_p6(uuid);

-- 2. Drop Phase 6 tables (cascades RLS and policies)
drop table if exists public.job_queue cascade;
drop table if exists public.order_events cascade;
drop table if exists public.upload_logs cascade;
drop table if exists public.media_usage cascade;

-- 3. Revert operation_logs type check constraint to Phase 4 defaults
alter table public.operation_logs drop constraint if exists operation_logs_type_check;
alter table public.operation_logs add constraint operation_logs_type_check check (type in ('error', 'health_check', 'backup', 'task_queue'));
```

### B. Application Rollback:
- Revert the main branch using Git:
  `git revert HEAD -m "Rollback to stable release"`
- Redeploy the previous verified build container to the cloud host.

---

## 4. Deployment Checklist
Verify these configurations before toggling the staging server to production mode:
- [ ] **DNS Records**: Bind `anshumanenterprises.online` and `futurewithai.online` to target hosting servers.
- [ ] **Env Variables Verification**: Run `validateEnv()` via `/api/health` to confirm zero missing keys.
- [ ] **Production Keys**: Ensure `NEXT_PUBLIC_APP_ENV` is set to `'production'` and all placeholder values in secrets are replaced with live credentials.
- [ ] **Supabase RLS Policies**: Check that RLS is enabled on all tables, especially the newly created Phase 6 tables.
- [ ] **PhonePe Payment Keys**: Confirm production salt key and merchant IDs are configured inside environment configurations.
- [ ] **Sitemaps**: Ensure `robots.txt` and `sitemap.xml` are accessible at root URL domains.
- [ ] **SMTP Email**: Ensure operations credentials (host, username, password) are active and SMTP tests in the Admin Console return success.

---
_Document Compiled by Antigravity AI Operations Engine._
