create table public.nba_standings (
  id smallint primary key default 1,
  data jsonb not null,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- RLS Policies
alter table public.nba_standings enable row level security;

-- Allow public read access
create policy "Allow public read access"
on public.nba_standings
for select
using (true);

-- Function to update the updated_at column on change
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at
before update on public.nba_standings
for each row
execute procedure moddatetime (updated_at);
