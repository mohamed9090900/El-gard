-- جرد البوفيه — separate Supabase project ONLY. Never run in production sales-buffet database.
-- Run using SQL Editor inside a NEW Supabase project dedicated to inventory.
create table if not exists public.inventory_documents (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null,
  revision bigint not null default 1 check(revision>=1),
  updated_at timestamptz not null default now()
);
alter table public.inventory_documents enable row level security;
revoke all on table public.inventory_documents from anon;
grant select on table public.inventory_documents to authenticated;
-- Authenticated account sees only its OWN document. Only RPC is allowed to write.
drop policy if exists inventory_owner_select on public.inventory_documents;
create policy inventory_owner_select on public.inventory_documents for select to authenticated using(owner_id=auth.uid());
-- Atomic compare-and-swap to prevent two devices overwriting one another.
create or replace function public.inventory_commit(expected_revision bigint,new_snapshot jsonb)
returns table(revision bigint)
language plpgsql security definer set search_path = public
as $$
declare updated_revision bigint;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if jsonb_typeof(new_snapshot) <> 'object' or (new_snapshot->>'schema')::int <> 1 then
    raise exception 'INVALID_SNAPSHOT';
  end if;
  if expected_revision < 0 then raise exception 'INVALID_REVISION'; end if;
  insert into public.inventory_documents(owner_id,snapshot,revision,updated_at)
  values(auth.uid(),new_snapshot,1,now())
  on conflict(owner_id) do update set
    snapshot=excluded.snapshot,
    revision=public.inventory_documents.revision+1,
    updated_at=now()
  where public.inventory_documents.revision=expected_revision
  returning public.inventory_documents.revision into updated_revision;
  if updated_revision is null then raise exception 'REVISION_CONFLICT'; end if;
  return query select updated_revision;
end;
$$;
revoke all on function public.inventory_commit(bigint,jsonb) from public,anon;
grant execute on function public.inventory_commit(bigint,jsonb) to authenticated;
-- Enable email/password Auth in Project Settings. Share the SAME account across devices.
-- Publishable/anon key ONLY in app; NEVER use service_role key in a browser.
