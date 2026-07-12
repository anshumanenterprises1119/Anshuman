-- 1. Create Media Usage Table
create table if not exists public.media_usage (
    id uuid default gen_random_uuid() primary key,
    file_url text not null,
    reference_type text not null check (reference_type in ('cms_section', 'product_detail', 'brand_logo', 'category_image')),
    reference_id text not null,
    brand_slug text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(file_url, reference_type, reference_id)
);

-- 2. Create Upload Logs Table
create table if not exists public.upload_logs (
    id uuid default gen_random_uuid() primary key,
    file_name text not null,
    file_url text not null unique,
    file_size bigint not null,
    mime_type text not null,
    is_compressed boolean default false not null,
    webp_generated boolean default false not null,
    brand_slug text not null,
    version integer default 1 not null,
    uploaded_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Order Events Table
create table if not exists public.order_events (
    id uuid default gen_random_uuid() primary key,
    order_id uuid not null, -- references orders(id) but keep as uuid for robustness
    event_type text not null, -- 'LOCK', 'PAYMENT_CLEARED', 'STATUS_CHANGE', 'WEBHOOK_RECEIVED', 'REFUND'
    payload jsonb not null default '{}'::jsonb,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Job Queue Table
create table if not exists public.job_queue (
    id uuid default gen_random_uuid() primary key,
    job_type text not null, -- 'webhook_retry', 'email_retry', 'shipment_update'
    payload jsonb not null default '{}'::jsonb,
    status text default 'pending'::text check (status in ('pending', 'processing', 'completed', 'failed', 'dlq')) not null,
    attempts integer default 0 not null,
    max_attempts integer default 5 not null,
    next_run_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_error text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.media_usage enable row level security;
alter table public.upload_logs enable row level security;
alter table public.order_events enable row level security;
alter table public.job_queue enable row level security;

-- 6. Create Security Definer Role Check Helper for Phase 6
create or replace function public.is_admin_or_staff_p6(user_id uuid)
returns boolean as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_id;
    return user_role in ('admin', 'staff');
end;
$$ language plpgsql security definer;

-- 7. Create RLS Policies

-- Media Usage Policies
create policy "Anyone can select media_usage" on public.media_usage
    for select using (true);
create policy "Admin/Staff can manage media_usage" on public.media_usage
    for all using (public.is_admin_or_staff_p6(auth.uid()));

-- Upload Logs Policies
create policy "Admin/Staff can manage upload_logs" on public.upload_logs
    for all using (public.is_admin_or_staff_p6(auth.uid()));
create policy "Users can view own upload_logs" on public.upload_logs
    for select using (auth.uid() = uploaded_by);

-- Order Events Policies
create policy "Admin/Staff can manage order_events" on public.order_events
    for all using (public.is_admin_or_staff_p6(auth.uid()));
create policy "Users can view own order_events" on public.order_events
    for select using (
        exists (
            select 1 from public.orders
            where orders.id = order_events.order_id and orders.profile_id = auth.uid()
        )
    );

-- Job Queue Policies
create policy "Admin/Staff can manage job_queue" on public.job_queue
    for all using (public.is_admin_or_staff_p6(auth.uid()));

-- 8. Create Performance Indexes
create index if not exists idx_media_usage_url on public.media_usage(file_url);
create index if not exists idx_media_usage_ref on public.media_usage(reference_type, reference_id);
create index if not exists idx_upload_logs_brand on public.upload_logs(brand_slug);
create index if not exists idx_order_events_order on public.order_events(order_id);
create index if not exists idx_job_queue_status_next_run on public.job_queue(status, next_run_at);

-- 9. Create Order Locking helper
create or replace function public.lock_order_row(target_order_id uuid)
returns boolean as $$
declare
    locked_status text;
begin
    select status into locked_status from public.orders where id = target_order_id for update;
    return true;
end;
$$ language plpgsql security definer;

-- 10. Alter operation_logs check constraint to allow wider type list for observability
alter table public.operation_logs drop constraint if exists operation_logs_type_check;
alter table public.operation_logs add constraint operation_logs_type_check check (type in ('error', 'health_check', 'backup', 'task_queue', 'request', 'performance', 'business', 'search', 'customer', 'admin'));
