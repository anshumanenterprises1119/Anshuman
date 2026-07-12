-- 1. Alter profiles table to add Customer Level column
alter table public.profiles add column if not exists level text default 'bronze'::text check (level in ('bronze', 'silver', 'gold'));

-- 2. Create Cart Items Table (Persistent Cart)
create table if not exists public.cart_items (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null check (quantity > 0),
    save_later boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(profile_id, product_id)
);

-- 3. Create CMS Pages Table
create table if not exists public.pages (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    title text not null,
    slug text not null,
    status text default 'draft'::text check (status in ('draft', 'published')) not null,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, slug)
);

-- 4. Create CMS Page Sections Table
create table if not exists public.page_sections (
    id uuid default gen_random_uuid() primary key,
    page_id uuid references public.pages(id) on delete cascade not null,
    type text not null check (type in ('hero', 'categories', 'products', 'reviews', 'features', 'faq', 'cta', 'newsletter')),
    sort_order integer not null default 0,
    content jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create CMS Page Revisions Table
create table if not exists public.page_revisions (
    id uuid default gen_random_uuid() primary key,
    page_id uuid references public.pages(id) on delete cascade not null,
    title text not null,
    seo_title text,
    seo_description text,
    sections_data jsonb not null,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Hero Content Table
create table if not exists public.hero_content (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    title text not null,
    subtitle text,
    cta_text text,
    cta_link text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create Product Views Table (Analytics)
create table if not exists public.product_views (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade not null,
    viewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create Product Compare Table
create table if not exists public.product_compare (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(profile_id, product_id)
);

-- 9. Create Payments Table
create table if not exists public.payments (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    payment_method text not null,
    provider text not null,
    transaction_id text,
    amount numeric(12,2) not null,
    status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Create Checkout Sessions Table
create table if not exists public.checkout_sessions (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    cart_items jsonb not null,
    shipping_address_id uuid references public.addresses(id) on delete set null,
    coupon_id uuid references public.coupons(id) on delete set null,
    status text default 'active'::text check (status in ('active', 'completed', 'abandoned')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Enable Row Level Security (RLS)
alter table public.cart_items enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.page_revisions enable row level security;
alter table public.hero_content enable row level security;
alter table public.product_views enable row level security;
alter table public.product_compare enable row level security;
alter table public.payments enable row level security;
alter table public.checkout_sessions enable row level security;

-- 12. Create Security Definer Role Check Helpers (Ensures compatibility)
create or replace function public.is_admin_or_staff_def(user_id uuid)
returns boolean as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_id;
    return user_role in ('admin', 'staff');
end;
$$ language plpgsql security definer;

-- 13. Create RLS Policies

-- Cart Items Policies
create policy "Users can manage own cart items" on public.cart_items
    for all using (auth.uid() = profile_id);

-- CMS Pages policies
create policy "Anyone can select pages" on public.pages
    for select using (true);
create policy "Admin/Staff can manage pages" on public.pages
    for all using (public.is_admin_or_staff_def(auth.uid()));

-- CMS Sections policies
create policy "Anyone can select page_sections" on public.page_sections
    for select using (true);
create policy "Admin/Staff can manage page_sections" on public.page_sections
    for all using (public.is_admin_or_staff_def(auth.uid()));

-- CMS Revisions policies
create policy "Admin/Staff can manage page_revisions" on public.page_revisions
    for all using (public.is_admin_or_staff_def(auth.uid()));

-- Hero Content policies
create policy "Anyone can select hero_content" on public.hero_content
    for select using (true);
create policy "Admin/Staff can manage hero_content" on public.hero_content
    for all using (public.is_admin_or_staff_def(auth.uid()));

-- Product Views policies
create policy "Anyone can log product views" on public.product_views
    for insert with check (true);
create policy "Admin/Staff can select product_views" on public.product_views
    for select using (public.is_admin_or_staff_def(auth.uid()));

-- Product Compare policies
create policy "Users can manage own compares" on public.product_compare
    for all using (auth.uid() = profile_id);

-- Payments policies
create policy "Admin/Staff can manage payments" on public.payments
    for all using (public.is_admin_or_staff_def(auth.uid()));
create policy "Users can view own payments" on public.payments
    for select using (
        exists (
            select 1 from public.orders
            where orders.id = payments.order_id and orders.profile_id = auth.uid()
        )
    );

-- Checkout Sessions policies
create policy "Users can manage own checkout sessions" on public.checkout_sessions
    for all using (auth.uid() = profile_id);

-- 14. Create Performance Indexes
create index if not exists idx_cart_profile on public.cart_items(profile_id);
create index if not exists idx_pages_brand_slug on public.pages(brand_id, slug);
create index if not exists idx_sections_page_order on public.page_sections(page_id, sort_order);
create index if not exists idx_revisions_page on public.page_revisions(page_id);
create index if not exists idx_views_product on public.product_views(product_id);
create index if not exists idx_compare_profile on public.product_compare(profile_id);
create index if not exists idx_payments_order on public.payments(order_id);
create index if not exists idx_checkout_profile on public.checkout_sessions(profile_id);
