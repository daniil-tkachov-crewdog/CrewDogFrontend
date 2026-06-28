-- Bullhorn multi-tenant integration: per-user OAuth connection storage.
--
-- Each CrewDog user connects their own Bullhorn account. Tokens are written and
-- read exclusively by Edge Functions using the service role (which bypasses RLS).
-- The browser may check whether a connection exists (status), but RLS deliberately
-- exposes no write paths, and the frontend never selects the token columns.

create table if not exists public.bullhorn_connections (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  access_token  text not null,
  refresh_token text not null,
  bh_rest_token text,
  rest_url      text,            -- per-user cluster, e.g. https://rest9.bullhornstaffing.com/rest-services/e123/
  expires_at    timestamptz,     -- access_token expiry (Bullhorn access tokens are short-lived)
  bh_user_id    bigint,          -- optional: Bullhorn internal user id
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.bullhorn_connections enable row level security;

-- The owner may read their own row (used by the frontend status check, which only
-- ever selects non-secret columns: user_id, rest_url, expires_at, updated_at).
drop policy if exists "owner can read own bullhorn connection" on public.bullhorn_connections;
create policy "owner can read own bullhorn connection"
  on public.bullhorn_connections
  for select
  using (auth.uid() = user_id);

-- The owner may delete (disconnect) their own connection. This exposes no secret
-- data and lets the frontend disconnect without a dedicated edge function.
drop policy if exists "owner can delete own bullhorn connection" on public.bullhorn_connections;
create policy "owner can delete own bullhorn connection"
  on public.bullhorn_connections
  for delete
  using (auth.uid() = user_id);

-- No insert/update policies are defined on purpose: the anon/authenticated roles
-- cannot write tokens. Only the service role (Edge Functions) can create/update rows.

-- Keep updated_at fresh on every write.
create or replace function public.set_bullhorn_connections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bullhorn_connections_updated_at on public.bullhorn_connections;
create trigger trg_bullhorn_connections_updated_at
  before update on public.bullhorn_connections
  for each row
  execute function public.set_bullhorn_connections_updated_at();
