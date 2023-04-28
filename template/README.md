## 用法

1.创建MemFire Cloud 应用

2.创建数据表

```sql
-- Create a table for public list
CREATE TABLE "public"."list" ( 
  "id" int8 PRIMARY KEY,
  "created_at" TIMESTAMP WITH TIME ZONE,
  "content" TEXT NOT NULL,
  "editable"  BOOLEAN NULL
);
-- Create a table for public log_list
CREATE TABLE "public"."log_list" ( 
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMP WITH TIME ZONE,
  "operat" TEXT NOT NULL
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table list
  enable row level security;

create policy "Public list are viewable by everyone." on list
  for select using (true);

create policy "Users can insert their own list." on list
  for insert with check (true);

create policy "Users can update own list." on list
  for update using (true);

create policy "Users can delete own list." on list
  for delete using (true);

alter table log_list
  enable row level security;

create policy "Public log_list are viewable by everyone." on log_list
  for select using (true);

create policy "Users can insert their own log_list." on log_list
  for insert with check (true);

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table public.list;

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using (auth.uid() = owner) with check (bucket_id = 'avatars');

```



```javascript

npm install

npm run dev

```
