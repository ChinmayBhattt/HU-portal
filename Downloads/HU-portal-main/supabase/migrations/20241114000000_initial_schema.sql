-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  date date not null,
  time time not null,
  location text not null,
  banner_url text,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_published boolean default false,
  max_capacity integer,
  requires_approval boolean default false,
  event_type text check (event_type in ('online', 'offline', 'hybrid')) default 'offline',
  meeting_url text,
  address text,
  city text,
  country text
);

-- Create event_registrations table
create table event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'approved', 'rejected', 'waitlisted')) default 'pending',
  checked_in boolean default false,
  checked_in_at timestamp with time zone,
  unique(event_id, user_id)
);

-- Create user_profiles table
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  skills text[] default '{}',
  college text,
  avatar_url text,
  bio text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_organizer boolean default false
);

-- Create community_join_requests table
create table community_join_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  user_id uuid references auth.users(id) on delete set null
);

-- Create blog_posts table
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text not null,
  featured_image text,
  author_id uuid references auth.users(id) on delete cascade not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tags text[] default '{}'
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_events_updated_at before update on events
  for each row execute function update_updated_at_column();

create trigger update_user_profiles_updated_at before update on user_profiles
  for each row execute function update_updated_at_column();

create trigger update_blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table events enable row level security;
alter table event_registrations enable row level security;
alter table user_profiles enable row level security;
alter table community_join_requests enable row level security;
alter table blog_posts enable row level security;

-- Create RLS policies for events
create policy "Events are viewable by everyone" on events
  for select using (is_published = true);

create policy "Users can create their own events" on events
  for insert with check (auth.uid() = created_by);

create policy "Users can update their own events" on events
  for update using (auth.uid() = created_by);

create policy "Users can delete their own events" on events
  for delete using (auth.uid() = created_by);

-- Create RLS policies for event_registrations
create policy "Users can view event registrations" on event_registrations
  for select using (true);

create policy "Users can register for events" on event_registrations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own registrations" on event_registrations
  for update using (auth.uid() = user_id);

create policy "Event organizers can manage registrations" on event_registrations
  for all using (
    exists (
      select 1 from events
      where events.id = event_registrations.event_id
      and events.created_by = auth.uid()
    )
  );

-- Create RLS policies for user_profiles
create policy "User profiles are viewable by everyone" on user_profiles
  for select using (true);

create policy "Users can create their own profile" on user_profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on user_profiles
  for update using (auth.uid() = id);

-- Create RLS policies for community_join_requests
create policy "Anyone can submit join requests" on community_join_requests
  for insert with check (true);

create policy "Only organizers can view join requests" on community_join_requests
  for select using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.is_organizer = true
    )
  );

create policy "Only organizers can update join requests" on community_join_requests
  for update using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.is_organizer = true
    )
  );

-- Create RLS policies for blog_posts
create policy "Published blog posts are viewable by everyone" on blog_posts
  for select using (published = true);

create policy "Users can create blog posts" on blog_posts
  for insert with check (auth.uid() = author_id);

create policy "Authors can update their own posts" on blog_posts
  for update using (auth.uid() = author_id);

create policy "Authors can delete their own posts" on blog_posts
  for delete using (auth.uid() = author_id);

-- Create function to handle user creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Create indexes for better performance
create index idx_events_date on events(date);
create index idx_events_category on events(category);
create index idx_events_created_by on events(created_by);
create index idx_events_published on events(is_published);
create index idx_event_registrations_event_id on event_registrations(event_id);
create index idx_event_registrations_user_id on event_registrations(user_id);
create index idx_event_registrations_status on event_registrations(status);
create index idx_blog_posts_slug on blog_posts(slug);
create index idx_blog_posts_published on blog_posts(published);
create index idx_community_join_requests_status on community_join_requests(status);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;