create table public.jean_piaget_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.jean_piaget_admins enable row level security;
revoke all on public.jean_piaget_admins from public,anon,authenticated;
grant select on public.jean_piaget_admins to authenticated;
grant all on public.jean_piaget_admins to service_role;
create policy jp_admin_self on public.jean_piaget_admins for select to authenticated using (user_id=(select auth.uid()));
insert into public.jean_piaget_admins(user_id) select id from auth.users where lower(email)='adriano.aimar12@gmail.com';
alter table public.jean_piaget_consultas add column notas text not null default '' check(char_length(notas)<=5000),
 add column updated_at timestamptz not null default now(), add column revision integer not null default 1;
alter table public.jean_piaget_consultas drop constraint jean_piaget_consultas_estado_check;
alter table public.jean_piaget_consultas add constraint jean_piaget_consultas_estado_check check(estado in ('pendiente','en_contacto','atendida','archivada'));
grant select(id,created_at,tipo,nombre,email,telefono,postulante,grado,motivo,mensaje,estado,consentimiento_version,notas,updated_at,revision) on public.jean_piaget_consultas to authenticated;
grant update(estado,notas) on public.jean_piaget_consultas to authenticated;
create policy jp_admin_read on public.jean_piaget_consultas for select to authenticated using (exists(select 1 from public.jean_piaget_admins where user_id=(select auth.uid())));
create policy jp_admin_update on public.jean_piaget_consultas for update to authenticated using (exists(select 1 from public.jean_piaget_admins where user_id=(select auth.uid()))) with check (exists(select 1 from public.jean_piaget_admins where user_id=(select auth.uid())));
create function public.jean_piaget_revision() returns trigger language plpgsql security invoker set search_path='' as $$
begin new.revision=old.revision+1; new.updated_at=now(); return new; end; $$;
revoke all on function public.jean_piaget_revision() from public,anon,authenticated;
create trigger jean_piaget_revision before update on public.jean_piaget_consultas for each row execute function public.jean_piaget_revision();
