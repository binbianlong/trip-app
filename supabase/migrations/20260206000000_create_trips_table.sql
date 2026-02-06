-- Create trips table
create table if not exists public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  destination text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.trips enable row level security;

-- Create policies
create policy "Users can view their own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can create their own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on public.trips for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.trips
  for each row
  execute function public.handle_updated_at();

-- Create indexes
create index trips_user_id_idx on public.trips(user_id);
create index trips_created_at_idx on public.trips(created_at desc);
