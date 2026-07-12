# Local & Cloud Setup Guide

This guide details step-by-step setup instructions for the upgraded Multi-Brand Ecommerce Platform.

---

## 1. Local Next.js Workspace Setup

1.  **Clone / Prepare Directory**:
    Verify you are running in the `ecommerce-platform/` subfolder.
2.  **Install Node Modules**:
    Run standard dependency installations:
    ```bash
    cd ecommerce-platform
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env.local` file inside `ecommerce-platform/` and add the following keys:
    ```env
    # Supabase Public Keys
    NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    
    # Supabase Private Admin Key (Bypasses RLS - keep safe!)
    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    
    # Cloudflare R2 Storage Keys (S3 API compatible)
    R2_ENDPOINT=https://your-cloudflare-account-id.r2.cloudflarestorage.com
    R2_ACCESS_KEY_ID=your-access-key-id
    R2_SECRET_ACCESS_KEY=your-secret-access-key
    
    # Fast2SMS Messaging Key
    FAST2SMS_API_KEY=bPiL4tl6Mq0DTOSWux9spBhzGeFCfEAQIknHU25Jj7ZN3VRoywV5Bno60E9xf4LC7licqmWXsMbItwRk
    
    # PhonePe PG Credentials (V2 API)
    PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
    PHONEPE_SALT_INDEX=1
    ```
4.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:3000`.

---

## 2. Supabase Cloud Configuration

1.  **Create Supabase Project**:
    Navigate to [Supabase Console](https://supabase.com) and click **New Project**. Define database parameters (select Region close to your users, e.g., Mumbai/India).
2.  **Execute Migrations Schema**:
    *   Open **SQL Editor** in the left sidebar.
    *   Create a new query.
    *   Open [20260623000000_init_schema.sql](file:///c:/Users/aditya%20tiwari/Downloads/ANSHU/supabase/migrations/20260623000000_init_schema.sql) and copy the entire text.
    *   Paste it into the editor and click **Run**.
3.  **Seed Default Brands**:
    Run this SQL snippet in the Supabase editor to populate your database with both brands:
    ```sql
    INSERT INTO public.brands (id, name, slug, domain) VALUES
      ('a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Anshuman Enterprises', 'anshuman-enterprises', 'anshumanenterprises.online'),
      ('f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'FutureWithAi', 'futurewithai', 'futurewithai.online');
    ```
4.  **OTP Authentication Setup**:
    *   Navigate to **Authentication** -> **Providers** -> **Phone**.
    *   Enable Phone Auth.
    *   Under SMS Provider, choose **Custom SMS Provider** or **Twilio** (Use Fast2SMS API webhook configuration to route SMS notifications).

---

## 3. Cloudflare R2 Setup

Cloudflare R2 provides cheap, object-class storage for both public static assets (images) and digital products.

1.  **Create Buckets**:
    *   Navigate to Cloudflare Console -> **R2**.
    *   Create `anshuman-assets` bucket. Set Public Access to **Allowed** (so product image URLs work).
    *   Create `futurewithai-downloads` bucket. Keep Public Access **Restricted** (Only Next.js backend API streams these files).
2.  **API Credentials**:
    *   Under R2 Settings, click **Manage R2 API Tokens**.
    *   Create a token with `Admin Read & Write` access permissions.
    *   Record the `Access Key ID`, `Secret Access Key`, and the `S3 Endpoint URL` and input them into your `.env.local` file.

---

## 4. Appsmith Dashboard Deployment

1.  **Launch Appsmith Workspace**:
    Create an account at [Appsmith Cloud](https://app.appsmith.com) or run a self-hosted Docker container.
2.  **Establish Database Link**:
    *   Under Datasources, select **PostgreSQL**.
    *   Copy connection parameters from **Supabase Settings** -> **Database** -> **Connection String** (Transaction pooler, Port 5432).
    *   Paste host, database name, port, username, and password into Appsmith connection profile. Ensure SSL is enabled.
3.  **Create Pages**:
    *   **Products Page**: Bind a query `SELECT * FROM products` to a Table Widget. Create a Form Widget to update properties, using SQL `UPDATE products SET name = {{InputName.text}} WHERE id = {{TableProducts.selectedRow.id}}`.
    *   **Orders Page**: Create visual tracking updates and status state controllers. Bind status actions to `/api/webhook` notifications if SMS triggers are desired.
