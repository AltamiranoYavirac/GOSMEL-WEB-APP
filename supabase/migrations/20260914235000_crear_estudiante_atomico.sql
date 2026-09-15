-- Evita fichas parciales: estudiante, vínculo y primer instrumento se crean
-- o se revierten juntos.
create or replace function public.crear_estudiante_administrativo(
  p_nombres text, p_apellidos text, p_fecha_nacimiento date, p_cedula text,
  p_celular text, p_email text, p_nivel_musical public.nivel_curso,
  p_biografia_corta text, p_representante_id uuid, p_parentesco public.parentesco,
  p_instrumento_id uuid
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_estudiante_id uuid;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede crear estudiantes'; end if;
  if coalesce(trim(p_nombres),'')='' or coalesce(trim(p_apellidos),'')='' then raise exception 'Nombres y apellidos son obligatorios'; end if;
  if p_fecha_nacimiento is null or p_fecha_nacimiento > current_date then raise exception 'La fecha de nacimiento no es válida'; end if;
  if p_representante_id is not null and not exists(select 1 from public.representantes where id=p_representante_id) then raise exception 'Representante no encontrado'; end if;
  if p_instrumento_id is not null and not exists(select 1 from public.instrumentos where id=p_instrumento_id) then raise exception 'Instrumento no encontrado'; end if;
  insert into public.estudiantes(nombres,apellidos,fecha_nacimiento,cedula,celular,email,nivel_musical,biografia_corta,fecha_ingreso,activo)
  values(trim(p_nombres),trim(p_apellidos),p_fecha_nacimiento,nullif(trim(p_cedula),''),nullif(trim(p_celular),''),nullif(trim(p_email),''),coalesce(p_nivel_musical,'iniciacion'),nullif(trim(p_biografia_corta),''),current_date,true)
  returning id into v_estudiante_id;
  if p_representante_id is not null then
    insert into public.estudiante_representante(estudiante_id,representante_id,parentesco,es_contacto_principal,autoriza_retiro)
    values(v_estudiante_id,p_representante_id,coalesce(p_parentesco,'tutor_legal'),true,true);
  end if;
  if p_instrumento_id is not null then
    insert into public.estudiante_instrumento(estudiante_id,instrumento_id,nivel)
    values(v_estudiante_id,p_instrumento_id,coalesce(p_nivel_musical,'iniciacion'));
  end if;
  return v_estudiante_id;
end $$;
grant execute on function public.crear_estudiante_administrativo(text,text,date,text,text,text,public.nivel_curso,text,uuid,public.parentesco,uuid) to authenticated;
