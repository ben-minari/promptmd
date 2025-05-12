-- Create function to increment usage_count
create or replace function increment_usage_count()
returns integer as $$
begin
  return coalesce(usage_count, 0) + 1;
end;
$$ language plpgsql;

-- Create function to decrement usage_count
create or replace function decrement_usage_count()
returns integer as $$
begin
  return greatest(coalesce(usage_count, 0) - 1, 0);
end;
$$ language plpgsql; 