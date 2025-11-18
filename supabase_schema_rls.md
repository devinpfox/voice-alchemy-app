## Supabase `profiles` Table Schema and RLS Policies

This document outlines the SQL schema for the `profiles` table and recommended Row Level Security (RLS) policies for your Supabase project.

### `profiles` Table Schema

The `profiles` table will store additional user information, including their role (student or instructor).

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'student' not null -- 'student' or 'instructor'
);

-- Add an index for faster lookups on username
create index on profiles (username);
```

### Row Level Security (RLS) Policies for `profiles`

These RLS policies ensure that users can only access and modify their own profile data, while allowing public viewing of profiles.

```sql
-- Set up Row Level Security (RLS)
-- Enable RLS on the profiles table
alter table profiles enable row level security;

-- Allow public read access for all profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

-- Allow authenticated users to insert their own profile
create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

-- Allow authenticated users to update their own profile
create policy "Users can update their own profile."
  on profiles for update using (auth.uid() = id);

-- Optionally, allow authenticated users to delete their own profile.
-- Consider carefully if you want to allow users to delete their profiles directly.
-- create policy "Users can delete their own profile."
--   on profiles for delete using (auth.uid() = id);
```

### Automatic Profile Creation on New User Signup

This trigger automatically creates a corresponding entry in the `profiles` table whenever a new user signs up via `auth.users`.

```sql
-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Supabase Storage RLS for Avatars (Example)

If you plan to store user avatars in Supabase Storage, here's an example of RLS policies for an `avatars` bucket.

```sql
-- Example: RLS for an 'avatars' storage bucket
-- First, create a storage bucket named 'avatars' in your Supabase project.

-- create policy "Avatar images are publicly accessible."
--   on storage.objects for select using (bucket_id = 'avatars');

-- create policy "Users can upload their own avatar."
--   on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() = owner);

-- create policy "Users can update their own avatar."
--   on storage.objects for update using (bucket_id = 'avatars' and auth.uid() = owner);

-- create policy "Users can delete their own avatar."
--   on storage.objects for delete using (bucket_id = 'avatars' and auth.uid() = owner);
```
