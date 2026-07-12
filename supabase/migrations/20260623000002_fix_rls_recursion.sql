-- 1. Create security definer helper functions to bypass RLS checks for role checks
create or replace function public.is_admin_or_staff(user_id uuid)
returns boolean as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_id;
    return user_role in ('admin', 'staff');
end;
$$ language plpgsql security definer;

create or replace function public.is_admin(user_id uuid)
returns boolean as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_id;
    return user_role = 'admin';
end;
$$ language plpgsql security definer;

-- 2. Patch public.profiles Policies (Resolves recursion)
drop policy if exists "Admins/Staff can read all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

create policy "Admins/Staff can read all profiles" on public.profiles
    for select using (public.is_admin_or_staff(auth.uid()));

create policy "Admins can update all profiles" on public.profiles
    for update using (public.is_admin(auth.uid()));

-- 3. Optimize other tables' policies using the new helpers
-- Addresses
drop policy if exists "Admins/Staff can view addresses" on public.addresses;
create policy "Admins/Staff can view addresses" on public.addresses
    for select using (public.is_admin_or_staff(auth.uid()));

-- Products
drop policy if exists "Admins/Staff can manage products" on public.products;
create policy "Admins/Staff can manage products" on public.products
    for all using (public.is_admin_or_staff(auth.uid()));

-- Categories
drop policy if exists "Admins/Staff can manage categories" on public.categories;
create policy "Admins/Staff can manage categories" on public.categories
    for all using (public.is_admin_or_staff(auth.uid()));

-- Orders
drop policy if exists "Admins/Staff can manage all orders" on public.orders;
create policy "Admins/Staff can manage all orders" on public.orders
    for all using (public.is_admin_or_staff(auth.uid()));

-- Order Items
drop policy if exists "Admins/Staff can view all order items" on public.order_items;
create policy "Admins/Staff can view all order items" on public.order_items
    for select using (public.is_admin_or_staff(auth.uid()));

-- Digital Access Tokens
drop policy if exists "Admins/Staff can manage access tokens" on public.digital_access_tokens;
create policy "Admins/Staff can manage access tokens" on public.digital_access_tokens
    for all using (public.is_admin_or_staff(auth.uid()));

-- Support Tickets
drop policy if exists "Admins/Staff can manage all support tickets" on public.support;
create policy "Admins/Staff can manage all support tickets" on public.support
    for all using (public.is_admin_or_staff(auth.uid()));
