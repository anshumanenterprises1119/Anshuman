-- Create Support Tickets Table
create table public.support (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    subject text not null,
    message text not null,
    status text default 'open'::text not null check (status in ('open', 'resolved')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.support enable row level security;

-- Policies
create policy "Users can view own support tickets" on public.support
    for select using (auth.uid() = profile_id);

create policy "Users can insert own support tickets" on public.support
    for insert with check (auth.uid() = profile_id);

create policy "Admins/Staff can manage all support tickets" on public.support
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
    );

-- Trigger for updated_at
create trigger tr_update_support_timestamp
    before update on public.support
    for each row execute function public.handle_update_timestamp();

-- Allow public select on brands (enabling RLS if not already enabled)
alter table public.brands enable row level security;
create policy "Anyone can read brands" on public.brands
    for select using (true);
