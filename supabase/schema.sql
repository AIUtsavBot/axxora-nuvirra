-- Nuvirra Ops CRM schema for Supabase
create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  city text not null default '',
  value_tier text not null default '',
  intent text not null default '',
  journey text not null default '',
  note text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table if not exists platforms (
  id text primary key,
  label text not null,
  description text not null default ''
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  summary text not null default ''
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  platform text not null references platforms(id),
  subject text not null,
  status text not null check (status in ('open','pending','closed')),
  source text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  author text not null,
  direction text not null check (direction in ('inbound','outbound')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_summary text not null,
  quantity integer not null check (quantity > 0),
  status text not null check (status in ('draft','confirmed','processing','shipped','delivered','cancelled')),
  tracking_reference text not null default '',
  channel text not null references platforms(id),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists support_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  topic text not null,
  status text not null check (status in ('open','in_progress','resolved')),
  priority text not null check (priority in ('low','medium','high')),
  resolution_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  topic text not null,
  source_platform text not null references platforms(id),
  status text not null check (status in ('new','reviewing','approved','completed')),
  campaign text not null default '',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table customers enable row level security;
alter table platforms enable row level security;
alter table products enable row level security;
alter table conversations enable row level security;
alter table conversation_messages enable row level security;
alter table orders enable row level security;
alter table support_cases enable row level security;
alter table content_requests enable row level security;

create policy if not exists "authenticated read customers" on customers for select to authenticated using (true);
create policy if not exists "authenticated insert customers" on customers for insert to authenticated with check (true);
create policy if not exists "authenticated update customers" on customers for update to authenticated using (true) with check (true);

create policy if not exists "authenticated read platforms" on platforms for select to authenticated using (true);
create policy if not exists "authenticated read products" on products for select to authenticated using (true);
create policy if not exists "authenticated insert products" on products for insert to authenticated with check (true);
create policy if not exists "authenticated update products" on products for update to authenticated using (true) with check (true);

create policy if not exists "authenticated read conversations" on conversations for select to authenticated using (true);
create policy if not exists "authenticated insert conversations" on conversations for insert to authenticated with check (true);
create policy if not exists "authenticated update conversations" on conversations for update to authenticated using (true) with check (true);

create policy if not exists "authenticated read conversation_messages" on conversation_messages for select to authenticated using (true);
create policy if not exists "authenticated insert conversation_messages" on conversation_messages for insert to authenticated with check (true);

create policy if not exists "authenticated read orders" on orders for select to authenticated using (true);
create policy if not exists "authenticated insert orders" on orders for insert to authenticated with check (true);
create policy if not exists "authenticated update orders" on orders for update to authenticated using (true) with check (true);

create policy if not exists "authenticated read support_cases" on support_cases for select to authenticated using (true);
create policy if not exists "authenticated insert support_cases" on support_cases for insert to authenticated with check (true);
create policy if not exists "authenticated update support_cases" on support_cases for update to authenticated using (true) with check (true);

create policy if not exists "authenticated read content_requests" on content_requests for select to authenticated using (true);
create policy if not exists "authenticated insert content_requests" on content_requests for insert to authenticated with check (true);
create policy if not exists "authenticated update content_requests" on content_requests for update to authenticated using (true) with check (true);

-- Campaigns table
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  budget numeric,
  telegram_chat_id text not null,
  status text not null check (status in ('pending_approval','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campaign Designs table
create table if not exists campaign_designs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text not null,
  status text not null check (status in ('pending_approval','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table campaigns enable row level security;
alter table campaign_designs enable row level security;

-- Policies for campaigns
create policy if not exists "authenticated read campaigns" on campaigns for select to authenticated using (true);
create policy if not exists "authenticated insert campaigns" on campaigns for insert to authenticated with check (true);
create policy if not exists "authenticated update campaigns" on campaigns for update to authenticated using (true) with check (true);

-- Policies for campaign_designs
create policy if not exists "authenticated read campaign_designs" on campaign_designs for select to authenticated using (true);
create policy if not exists "authenticated insert campaign_designs" on campaign_designs for insert to authenticated with check (true);
create policy if not exists "authenticated update campaign_designs" on campaign_designs for update to authenticated using (true) with check (true);

