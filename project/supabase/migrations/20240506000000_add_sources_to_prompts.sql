-- Add sources column to prompts table
alter table prompts add column sources text[] default '{}'::text[];

-- Update existing rows to have empty sources array
update prompts set sources = '{}'::text[] where sources is null; 