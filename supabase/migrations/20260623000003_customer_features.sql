-- Create Wishlists Table
create table public.wishlists (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(profile_id, product_id)
);

-- Create Reviews Table
create table public.reviews (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Rewards Table
create table public.rewards (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    points integer default 0 not null check (points >= 0),
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;
alter table public.rewards enable row level security;

-- Policies for Wishlists
create policy "Users can manage own wishlists" on public.wishlists
    for all using (auth.uid() = profile_id);

create policy "Admins/Staff can read all wishlists" on public.wishlists
    for select using (public.is_admin_or_staff(auth.uid()));

-- Policies for Reviews
create policy "Anyone can read reviews" on public.reviews
    for select using (true);

create policy "Users can manage own reviews" on public.reviews
    for all using (auth.uid() = profile_id);

-- Policies for Rewards
create policy "Users can view own rewards" on public.rewards
    for select using (auth.uid() = profile_id);

create policy "Admins/Staff can manage rewards" on public.rewards
    for all using (public.is_admin_or_staff(auth.uid()));

-- Indexes for performance
create index idx_wishlists_profile on public.wishlists(profile_id);
create index idx_reviews_product on public.reviews(product_id);
create index idx_rewards_profile on public.rewards(profile_id);
