create or replace function public.solicitar_matricula(
  p_catedra_id uuid,
  p_para_menor boolean,
  p_nombres text,
  p_apellidos text,
  p_fecha_nacimiento date,
  p_parentesco public.parentesco default null
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_estudiante uuid;
  v_repre uuid;
  v_insc uuid;
  v_insc_existente record;
begin
  if v_uid is null then raise exception 'Debe iniciar sesion'; end if;

  if p_para_menor then
    insert into public.representantes (perfil_id, nombres, apellidos, celular, email)
    select v_uid, p.nombres, p.apellidos, p.celular, p.email
      from public.perfiles p where p.id = v_uid
    on conflict (perfil_id) do update set updated_at = now()
    returning id into v_repre;

    insert into public.perfil_rol (perfil_id, rol) values (v_uid, 'representante')
      on conflict do nothing;

    insert into public.estudiantes (nombres, apellidos, fecha_nacimiento)
      values (p_nombres, p_apellidos, p_fecha_nacimiento) returning id into v_estudiante;

    insert into public.estudiante_representante
      (estudiante_id, representante_id, parentesco, es_contacto_principal)
      values (v_estudiante, v_repre, coalesce(p_parentesco, 'tutor_legal'), true);
  else
    select id into v_estudiante from public.estudiantes where perfil_id = v_uid;
    if v_estudiante is null then
      insert into public.estudiantes (perfil_id, nombres, apellidos, fecha_nacimiento, email)
        select v_uid, p_nombres, p_apellidos, p_fecha_nacimiento, p.email
          from public.perfiles p where p.id = v_uid returning id into v_estudiante;
    end if;
    insert into public.perfil_rol (perfil_id, rol) values (v_uid, 'estudiante')
      on conflict do nothing;
  end if;

  select id, estado into v_insc_existente from public.inscripciones
    where estudiante_id = v_estudiante and catedra_id = p_catedra_id;

  if v_insc_existente.id is not null then
    if v_insc_existente.estado in ('activa', 'pendiente') then
      raise exception 'Ya estás matriculado o tienes una solicitud pendiente en esta cátedra';
    else
      update public.inscripciones
      set estado = 'pendiente',
          solicitada_por = v_uid,
          fecha_inscripcion = now(),
          aprobada_por = null,
          aprobada_en = null,
          motivo_rechazo = null,
          progreso_pct = 0
      where id = v_insc_existente.id
      returning id into v_insc;
      return v_insc;
    end if;
  end if;

  insert into public.inscripciones (estudiante_id, catedra_id, estado, solicitada_por)
    values (v_estudiante, p_catedra_id, 'pendiente', v_uid) returning id into v_insc;
  return v_insc;
end;
$$;
