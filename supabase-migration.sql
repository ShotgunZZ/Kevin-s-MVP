-- Members Portal Database Migration
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create members table
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  membership_tier text not null,
  status text not null default 'active' check (status in ('active', 'pending', 'expired', 'suspended')),
  join_date timestamp with time zone default now(),
  benefits jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create tickets table
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade not null,
  event_name text not null,
  event_date date not null,
  quantity int not null check (quantity > 0),
  intent text not null check (intent in ('swap', 'donate')),
  status text not null default 'available' check (status in ('available', 'claimed', 'fulfilled', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create activity_log table
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade not null,
  ticket_id uuid references public.tickets(id) on delete set null,
  action_type text not null,
  timestamp timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists idx_members_user_id on public.members(user_id);
create index if not exists idx_tickets_member_id on public.tickets(member_id);
create index if not exists idx_tickets_status on public.tickets(status);
create index if not exists idx_tickets_event_date on public.tickets(event_date);
create index if not exists idx_activity_log_member_id on public.activity_log(member_id);
create index if not exists idx_activity_log_ticket_id on public.activity_log(ticket_id);

-- Enable Row Level Security
alter table public.members enable row level security;
alter table public.tickets enable row level security;
alter table public.activity_log enable row level security;

-- RLS Policies for members table
create policy "Users can view their own member profile"
  on public.members for select
  using (auth.uid() = user_id);

create policy "Users can insert their own member profile"
  on public.members for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own member profile"
  on public.members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policies for tickets table
create policy "Authenticated users can view all tickets"
  on public.tickets for select
  using (auth.role() = 'authenticated');

create policy "Members can insert tickets"
  on public.tickets for insert
  with check (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  );

create policy "Members can update their own tickets"
  on public.tickets for update
  using (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  )
  with check (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  );

create policy "Members can delete their own tickets"
  on public.tickets for delete
  using (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  );

-- RLS Policies for activity_log table
create policy "Users can view their own activity log"
  on public.activity_log for select
  using (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  );

create policy "System can insert activity logs"
  on public.activity_log for insert
  with check (
    auth.uid() in (
      select user_id from public.members where id = member_id
    )
  );

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers to update updated_at
create trigger set_updated_at
  before update on public.members
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.tickets
  for each row
  execute function public.handle_updated_at();

-- Function to create member profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.members (user_id, membership_tier, status)
  values (new.id, 'basic', 'active');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create member profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to log activity
create or replace function public.log_activity(
  p_member_id uuid,
  p_ticket_id uuid,
  p_action_type text
)
returns uuid as $$
declare
  v_activity_id uuid;
begin
  insert into public.activity_log (member_id, ticket_id, action_type)
  values (p_member_id, p_ticket_id, p_action_type)
  returning id into v_activity_id;

  return v_activity_id;
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.members to anon, authenticated;
grant all on public.tickets to anon, authenticated;
grant all on public.activity_log to anon, authenticated;

-- Insert sample membership tiers data (optional - for development)
-- You can remove this section in production

comment on table public.members is 'Stores member profile information';
comment on table public.tickets is 'Stores ticket postings for swap or donation';
comment on table public.activity_log is 'Tracks member activity and ticket transactions';
