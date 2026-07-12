-- 1. Create Product Attributes Table
create table if not exists public.product_attributes (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    name text not null,
    value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Product Media Table (Multiple gallery images)
create table if not exists public.product_media (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    url text not null,
    sort_order integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Product SEO Settings Table
create table if not exists public.product_seo (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null unique,
    title text,
    description text,
    keywords text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Purchase Access Table (Digital vault validation)
create table if not exists public.purchase_access (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    order_id uuid references public.orders(id) on delete cascade not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(profile_id, product_id)
);

-- 5. Create Downloads Log Table
create table if not exists public.downloads (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    digital_asset_id uuid references public.digital_assets(id) on delete cascade not null,
    ip_address text,
    user_agent text,
    downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create License Keys Table
create table if not exists public.licenses (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    license_key text not null unique,
    status text default 'active'::text check (status in ('active', 'revoked', 'expired')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create Customer Loyalty Reward History Table
create table if not exists public.reward_history (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    points_change integer not null,
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create Customer Level Threshold Rules Table
create table if not exists public.level_rules (
    id uuid default gen_random_uuid() primary key,
    level text not null unique check (level in ('bronze', 'silver', 'gold')),
    min_spend numeric(12,2) not null,
    benefits_description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Create Search History Table
create table if not exists public.search_history (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade,
    query text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Create Operational Logs Table
create table if not exists public.operation_logs (
    id uuid default gen_random_uuid() primary key,
    type text not null check (type in ('error', 'health_check', 'backup', 'task_queue')),
    severity text not null check (severity in ('info', 'warning', 'error', 'critical')),
    message text not null,
    details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Populate Default Loyalty Level Rules
insert into public.level_rules (level, min_spend, benefits_description) values
('bronze', 0.00, 'Basic membership, standard pricing model.'),
('silver', 5000.00, '5% discount on all active cart catalog items.'),
('gold', 20000.00, '10% discount on all active cart catalog items, priority shipping support.')
on conflict (level) do update set
    min_spend = excluded.min_spend,
    benefits_description = excluded.benefits_description;

-- 12. Enable Row Level Security (RLS)
alter table public.product_attributes enable row level security;
alter table public.product_media enable row level security;
alter table public.product_seo enable row level security;
alter table public.purchase_access enable row level security;
alter table public.downloads enable row level security;
alter table public.licenses enable row level security;
alter table public.reward_history enable row level security;
alter table public.level_rules enable row level security;
alter table public.search_history enable row level security;
alter table public.operation_logs enable row level security;

-- 13. Create Role Check Helper (Resolves RLS recursion)
create or replace function public.is_admin_or_staff_p4(user_id uuid)
returns boolean as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_id;
    return user_role in ('admin', 'staff');
end;
$$ language plpgsql security definer;

-- 14. Create RLS Policies

-- Product Attributes & Media Policies
create policy "Anyone can select attributes" on public.product_attributes for select using (true);
create policy "Admin/Staff can manage attributes" on public.product_attributes for all using (public.is_admin_or_staff_p4(auth.uid()));

create policy "Anyone can select media" on public.product_media for select using (true);
create policy "Admin/Staff can manage media" on public.product_media for all using (public.is_admin_or_staff_p4(auth.uid()));

create policy "Anyone can select product SEO" on public.product_seo for select using (true);
create policy "Admin/Staff can manage product SEO" on public.product_seo for all using (public.is_admin_or_staff_p4(auth.uid()));

-- Purchase Access Policies
create policy "Users can view own purchase access" on public.purchase_access for select using (auth.uid() = profile_id);
create policy "Admin/Staff can manage purchase access" on public.purchase_access for all using (public.is_admin_or_staff_p4(auth.uid()));

-- Downloads Policies
create policy "Users can view own downloads" on public.downloads for select using (auth.uid() = profile_id);
create policy "Users can insert own downloads" on public.downloads for insert with check (auth.uid() = profile_id);
create policy "Admin/Staff can select downloads" on public.downloads for select using (public.is_admin_or_staff_p4(auth.uid()));

-- Licenses Policies
create policy "Users can view own licenses" on public.licenses for select using (auth.uid() = profile_id);
create policy "Admin/Staff can manage licenses" on public.licenses for all using (public.is_admin_or_staff_p4(auth.uid()));

-- Rewards Policies
create policy "Users can view own reward history" on public.reward_history for select using (auth.uid() = profile_id);
create policy "Admin/Staff can manage reward history" on public.reward_history for all using (public.is_admin_or_staff_p4(auth.uid()));

create policy "Anyone can view level rules" on public.level_rules for select using (true);
create policy "Admin/Staff can manage level rules" on public.level_rules for all using (public.is_admin_or_staff_p4(auth.uid()));

-- Search History Policies
create policy "Users can manage own search history" on public.search_history for all using (auth.uid() = profile_id);

-- Operational Logs Policies
create policy "Admin/Staff can manage operational logs" on public.operation_logs for all using (public.is_admin_or_staff_p4(auth.uid()));

-- 15. Create Performance Indexes
create index if not exists idx_attributes_product on public.product_attributes(product_id);
create index if not exists idx_media_product on public.product_media(product_id);
create index if not exists idx_seo_product on public.product_seo(product_id);
create index if not exists idx_purchase_profile on public.purchase_access(profile_id);
create index if not exists idx_downloads_asset on public.downloads(digital_asset_id);
create index if not exists idx_licenses_profile on public.licenses(profile_id);
create index if not exists idx_reward_hist_profile on public.reward_history(profile_id);
create index if not exists idx_search_hist_profile on public.search_history(profile_id);
create index if not exists idx_op_logs_type on public.operation_logs(type);
