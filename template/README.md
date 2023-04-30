## 用法

1.创建MemFire Cloud 应用

2.创建数据表

```sql
-- Create a table for public profiles
CREATE TABLE "public"."profile" ( 
  "id" uuid default uuid_generate_v4() primary key,
  "created_at" timestamp default now() ,
  "email" TEXT,
  "user_name" TEXT,
  "avatar" VARCHAR,
  "introduction" VARCHAR
);
-- Create a table for public account
CREATE TABLE "public"."account" ( 
  "id" SERIAL,
  "created_at" timestamp default now() ,
  "user_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "age" INT NOT NULL,
  "address" TEXT NOT NULL
);
-- Create a table for public messages
CREATE TABLE "public"."messages" ( 
  "id" SERIAL,
  "user_id" uuid references public.profile not null,
  "created_at" timestamp default now() ,
  "message" TEXT NOT NULL,
  "user_name" TEXT NOT NULL,
  "avatar" VARCHAR NOT NULL
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profile enable row level security;

create policy "Public profile are viewable by everyone."
  on profile for select
  using ( true );

create policy "Users can insert their own profile."
  on profile for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profile for update
  using ( auth.uid() = id );

alter table account
  enable row level security;

create policy "Public account are viewable by everyone." on account
  for select using (true);

create policy "Users can insert their own account." on account
  for insert with check (true);

create policy "Users can select their own account." on account
  for update using (true);

create policy "Users can delete their own account." on account
  for delete using (true);

alter table messages
  enable row level security;

create policy "Public messages are viewable by everyone." on messages
  for select using (true);

create policy "Users can insert their own messages." on messages
  for insert with check (auth.uid() = user_id);

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
alter publication supabase_realtime add table public.messages;

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

insert into storage.buckets (id, name)
values ('files', 'files');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "files images are publicly accessible." on storage.objects
  for select using ( true );

create policy "Own can upload an files." on storage.objects
  for insert with check (true);

create policy "Own can update their own files." on storage.objects
  for update using ( true );

create policy "Own can delete their own files." on storage.objects
  for delete using ( true);
```
3.在.env文件里配置memfire cloud应用的API访问地址和anon_key