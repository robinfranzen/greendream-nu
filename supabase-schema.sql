-- GreenDream database schema for Supabase

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references categories(id),
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  stock integer not null default 0,
  category_id uuid references categories(id),
  images text[] default '{}',
  is_featured boolean default false,
  is_new boolean default false,
  created_at timestamptz default now()
);

-- Customers (extends Supabase auth.users)
create table customers (
  id uuid primary key references auth.users(id),
  email text not null,
  full_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  customer_email text not null,
  customer_name text not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  created_at timestamptz default now()
);

-- Order items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  product_image text,
  quantity integer not null,
  price numeric(10,2) not null
);

-- Newsletter subscribers
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Blog posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  image_url text,
  published boolean default false,
  created_at timestamptz default now()
);

-- RLS policies (enable row level security)
alter table categories enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscribers enable row level security;
alter table blog_posts enable row level security;

-- Public read for categories, products, published blog posts
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read products" on products for select using (true);
create policy "Public can read published posts" on blog_posts for select using (published = true);

-- Subscribers: anyone can insert their email
create policy "Anyone can subscribe" on subscribers for insert with check (true);

-- Customers: can read/update their own row
create policy "Customers can read own data" on customers for select using (auth.uid() = id);
create policy "Customers can update own data" on customers for update using (auth.uid() = id);

-- Orders: customers see their own orders
create policy "Customers see own orders" on orders for select using (auth.uid() = customer_id);

-- Admin policies (service role key bypasses RLS)
