create function public.jean_piaget_submit(p_payload jsonb, p_ip_hash text) returns text
language plpgsql security invoker set search_path = '' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));
 if exists(select 1 from public.jean_piaget_consultas where id=(p_payload->>'id')::uuid) then return 'accepted'; end if;
 if (select count(*) from public.jean_piaget_consultas where ip_hash=p_ip_hash and created_at>now()-interval '1 hour') >= 5 then return 'limited'; end if;
 insert into public.jean_piaget_consultas(id,tipo,nombre,email,telefono,postulante,grado,motivo,mensaje,consentimiento_version,ip_hash)
 values((p_payload->>'id')::uuid,p_payload->>'tipo',p_payload->>'nombre',p_payload->>'email',p_payload->>'telefono',p_payload->>'postulante',p_payload->>'grado',p_payload->>'motivo',p_payload->>'mensaje','2026-11-11',p_ip_hash);
 return 'accepted';
end;
$$;
revoke all on function public.jean_piaget_submit(jsonb,text) from public,anon,authenticated;
grant execute on function public.jean_piaget_submit(jsonb,text) to service_role;
