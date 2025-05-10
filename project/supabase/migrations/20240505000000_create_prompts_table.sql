-- Create prompts table
create table prompts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  content text not null,
  category text not null,
  specialty text not null,
  tools text[] not null,
  author jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  rating numeric default 0 not null,
  rating_count integer default 0 not null,
  usage_count integer default 0 not null,
  featured boolean default false not null
);

-- Enable Row Level Security
alter table prompts enable row level security;

-- Create policies
create policy "Public prompts are viewable by everyone"
  on prompts for select
  using ( true );

create policy "Users can insert their own prompts"
  on prompts for insert
  with check ( auth.uid() = (author->>'id')::uuid );

create policy "Users can update their own prompts"
  on prompts for update
  using ( auth.uid() = (author->>'id')::uuid );

create policy "Users can delete their own prompts"
  on prompts for delete
  using ( auth.uid() = (author->>'id')::uuid );

-- Create saved_prompts table
create table saved_prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  prompt_id uuid references prompts not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- Enable Row Level Security
alter table saved_prompts enable row level security;

-- Create policies
create policy "Users can view their own saved prompts"
  on saved_prompts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved prompts"
  on saved_prompts for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own saved prompts"
  on saved_prompts for delete
  using ( auth.uid() = user_id ); 