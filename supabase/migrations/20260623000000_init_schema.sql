-- --------------------------------------------------
-- Supabase Schema Initialization
-- Target: 1000+ Concurrent Users, Mobile First, Low Cost
-- Brands: Anshuman Enterprises (Physical), FutureWithAi (Digital)
-- --------------------------------------------------

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- --------------------------------------------------
-- 1. TABLES
-- --------------------------------------------------

-- Brands Table
create table public.brands (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    domain text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles Table (synchronized with auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    full_name text,
    phone_number text,
    role text default 'customer'::text not null check (role in ('customer', 'staff', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Addresses Table (Shipping and Billing for physical products)
create table public.addresses (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    type text not null check (type in ('shipping', 'billing')),
    address_line1 text not null,
    address_line2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country text default 'India'::text not null,
    is_default boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories Table
create table public.categories (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    name text not null,
    slug text not null,
    parent_id uuid references public.categories(id) on delete set null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, slug)
);

-- Products Table (Physical & Digital)
create table public.products (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    name text not null,
    slug text not null,
    description text,
    type text not null check (type in ('physical', 'digital')),
    sku text,
    base_price numeric(12,2) not null,
    sale_price numeric(12,2),
    is_active boolean default true not null,
    metadata jsonb default '{}'::jsonb not null, -- JSON specs: Weight, Dimensions, File size, Format etc.
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, slug),
    unique(brand_id, sku)
);

-- Inventory Table (For Physical items)
create table public.inventory (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null unique,
    quantity integer default 0 not null check (quantity >= 0),
    reserved integer default 0 not null check (reserved >= 0),
    low_stock_threshold integer default 5 not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Digital Assets Table (Secure references to Cloudflare R2 downloads)
create table public.digital_assets (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    file_path text not null, -- Cloudflare R2 key name
    file_name text not null, -- User visible filename on download
    file_size bigint not null, -- bytes
    access_duration_days integer, -- Null = Lifetime
    download_limit integer, -- Null = Unlimited
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coupons Table (Shared / Multi-brand discounts)
create table public.coupons (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    code text not null,
    type text not null check (type in ('percentage', 'fixed_amount')),
    value numeric(12,2) not null check (value > 0),
    min_purchase_amount numeric(12,2) default 0.00 not null check (min_purchase_amount >= 0),
    starts_at timestamp with time zone,
    expires_at timestamp with time zone,
    usage_limit integer,
    usage_count integer default 0 not null check (usage_count >= 0),
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, code)
);

-- Orders Table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    profile_id uuid references public.profiles(id) on delete set null,
    order_number text not null unique,
    status text default 'pending'::text not null check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned')),
    shipping_address jsonb, -- Copy of shipping address frozen at time of order
    billing_address jsonb, -- Copy of billing address frozen at time of order
    subtotal numeric(12,2) not null,
    discount_amount numeric(12,2) default 0.00 not null,
    shipping_fee numeric(12,2) default 0.00 not null,
    total_amount numeric(12,2) not null,
    payment_method text not null check (payment_method in ('cod', 'upi', 'card')),
    payment_status text default 'pending'::text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    coupon_id uuid references public.coupons(id) on delete set null,
    tracking_number text,
    carrier text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price numeric(12,2) not null,
    discount numeric(12,2) default 0.00 not null,
    total numeric(12,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Digital Access Tokens (Validates secure URLs for buyers)
create table public.digital_access_tokens (
    id uuid default gen_random_uuid() primary key,
    order_item_id uuid references public.order_items(id) on delete cascade not null,
    profile_id uuid references public.profiles(id) on delete cascade,
    token text not null unique,
    expires_at timestamp with time zone,
    download_count integer default 0 not null check (download_count >= 0),
    max_downloads integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Tracking Table
create table public.order_tracking (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    status text not null,
    description text,
    location text,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text not null check (type in ('order_update', 'promotion', 'download_ready')),
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CMS Content Table (Dynamic brand-specific content configs)
create table public.cms_content (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    key text not null,
    title text,
    content jsonb not null,
    is_published boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, key)
);

-- --------------------------------------------------
-- 2. INDEXES
-- --------------------------------------------------
create index idx_products_brand_type on public.products(brand_id, type);
create index idx_products_slug on public.products(slug);
create index idx_orders_profile_id on public.orders(profile_id);
create index idx_orders_brand_status on public.orders(brand_id, status);
create index idx_digital_tokens on public.digital_access_tokens(token);
create index idx_inventory_product on public.inventory(product_id);
create index idx_addresses_profile on public.addresses(profile_id);

-- --------------------------------------------------
-- 3. TRIGGERS & PROCEDURES
-- --------------------------------------------------

-- Auto-update timestamps
create or replace function public.handle_update_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger tr_update_profile_timestamp
    before update on public.profiles
    for each row execute function public.handle_update_timestamp();

create trigger tr_update_product_timestamp
    before update on public.products
    for each row execute function public.handle_update_timestamp();

create trigger tr_update_order_timestamp
    before update on public.orders
    for each row execute function public.handle_update_timestamp();

-- Create customer profile automatically when a user signs up on Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, phone_number, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        new.phone,
        'customer'
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- --------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.digital_access_tokens enable row level security;
alter table public.notifications enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);
create policy "Admins/Staff can read all profiles" on public.profiles
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );
create policy "Admins can update all profiles" on public.profiles
    for update using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- Addresses Policies
create policy "Users can manage their own addresses" on public.addresses
    for all using (profile_id = auth.uid());
create policy "Admins/Staff can view addresses" on public.addresses
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Products Policies
create policy "Anyone can view active products" on public.products
    for select using (is_active = true);
create policy "Admins/Staff can manage products" on public.products
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Categories Policies
create policy "Anyone can view categories" on public.categories
    for select using (true);
create policy "Admins/Staff can manage categories" on public.categories
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Orders Policies
create policy "Users can view their own orders" on public.orders
    for select using (profile_id = auth.uid());
create policy "Users can insert their own orders" on public.orders
    for insert with check (profile_id = auth.uid());
create policy "Admins/Staff can manage all orders" on public.orders
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Order Items Policies
create policy "Users can view own order items" on public.order_items
    for select using (
        exists (select 1 from public.orders where id = order_items.order_id and profile_id = auth.uid())
    );
create policy "Admins/Staff can view all order items" on public.order_items
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Digital Access Tokens Policies
create policy "Users can view own access tokens" on public.digital_access_tokens
    for select using (profile_id = auth.uid());
create policy "Admins/Staff can manage access tokens" on public.digital_access_tokens
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Notifications Policies
create policy "Users can manage own notifications" on public.notifications
    for all using (profile_id = auth.uid());
