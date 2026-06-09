-- Run in Supabase SQL editor
create table if not exists search_logs (
  id uuid default gen_random_uuid() primary key,
  query text not null,
  user_id text,
  results_count integer default 0,
  ai_model_used text,
  created_at timestamp with time zone default now()
);
create index if not exists search_logs_created_at_idx on search_logs(created_at desc);
create index if not exists search_logs_user_id_idx on search_logs(user_id);
alter table search_logs enable row level security;
create policy "Allow insert from API" on search_logs for insert with check (true);
create or replace view popular_queries as
  select query, count(*) as search_count, max(created_at) as last_searched
  from search_logs
  where created_at > now() - interval '7 days'
  group by query order by search_count desc limit 100;