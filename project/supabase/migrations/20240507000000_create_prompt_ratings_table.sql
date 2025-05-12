-- Create prompt_ratings table
create table prompt_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  prompt_id uuid references prompts not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- Enable Row Level Security
alter table prompt_ratings enable row level security;

-- Create policies
create policy "Users can view all prompt ratings"
  on prompt_ratings for select
  using ( true );

create policy "Users can insert their own ratings"
  on prompt_ratings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own ratings"
  on prompt_ratings for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own ratings"
  on prompt_ratings for delete
  using ( auth.uid() = user_id );

-- Create function to update prompt rating statistics
create or replace function update_prompt_rating_stats()
returns trigger as $$
declare
  affected_prompt_id uuid;
  avg_rating numeric;
  rating_count integer;
begin
  -- Determine which prompt_id to update
  if (TG_OP = 'DELETE') then
    affected_prompt_id := old.prompt_id;
  else
    affected_prompt_id := new.prompt_id;
  end if;

  -- Calculate new statistics
  select 
    coalesce(avg(rating)::numeric, 0),
    coalesce(count(*), 0)
  into avg_rating, rating_count
  from prompt_ratings
  where prompt_id = affected_prompt_id;

  -- Log the values for debugging
  raise notice 'Updating prompt %: avg_rating=%, rating_count=%', affected_prompt_id, avg_rating, rating_count;

  -- Update the prompt's rating statistics
  update prompts
  set 
    rating = avg_rating,
    rating_count = rating_count
  where id = affected_prompt_id;
  
  -- Log the update result
  raise notice 'Updated prompt % with rating=% and rating_count=%', affected_prompt_id, avg_rating, rating_count;
  
  if (TG_OP = 'DELETE') then
    return old;
  else
    return new;
  end if;
end;
$$ language plpgsql security definer;

-- Drop existing triggers if they exist
drop trigger if exists update_prompt_rating_stats_insert on prompt_ratings;
drop trigger if exists update_prompt_rating_stats_update on prompt_ratings;
drop trigger if exists update_prompt_rating_stats_delete on prompt_ratings;

-- Create triggers for insert, update, and delete
create trigger update_prompt_rating_stats_insert
  after insert on prompt_ratings
  for each row
  execute function update_prompt_rating_stats();

create trigger update_prompt_rating_stats_update
  after update on prompt_ratings
  for each row
  execute function update_prompt_rating_stats();

create trigger update_prompt_rating_stats_delete
  after delete on prompt_ratings
  for each row
  execute function update_prompt_rating_stats(); 