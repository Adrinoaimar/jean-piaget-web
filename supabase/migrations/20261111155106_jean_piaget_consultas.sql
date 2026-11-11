create table public.jean_piaget_consultas (
 id uuid primary key,
 created_at timestamptz not null default now(),
 tipo text not null check (tipo in ('contacto','admision')),
 nombre text not null check (char_length(nombre) between 2 and 100),
 email text not null check (char_length(email) <= 254),
 telefono text not null default '' check (char_length(telefono)<=30),
 postulante text check (char_length(postulante)<=100),
 grado text check (char_length(grado)<=30),
 motivo text check (char_length(motivo)<=30),
 mensaje text check (char_length(mensaje)<=3000),
 estado text not null default 'pendiente' check (estado in ('pendiente','en_contacto','atendida')),
 consentimiento_version text not null,
 ip_hash text not null
);
alter table public.jean_piaget_consultas enable row level security;
revoke all on public.jean_piaget_consultas from public, anon, authenticated;
grant select, insert, update, delete on public.jean_piaget_consultas to service_role;
create index jean_piaget_consultas_ip_fecha on public.jean_piaget_consultas(ip_hash, created_at desc);
create index jean_piaget_consultas_estado_fecha on public.jean_piaget_consultas(estado, created_at desc);
comment on table public.jean_piaget_consultas is 'Consultas de Contacto y Admisión de Jean Piaget Sullana. Acceso solo desde servicio o panel Supabase autorizado.';
