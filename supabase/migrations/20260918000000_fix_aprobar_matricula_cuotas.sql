-- Fix aprobar_matricula / matricular_estudiante_directo tras rediseño de cobranzas.
-- Las cuotas exigen estudiante_id NOT NULL (+ tipo/origen) y los acuerdos
-- necesitan su condición inicial en acuerdo_condiciones para la generación
-- mensual. Además se resuelve el responsable representante y se permite
-- reintentar inscripciones que quedaron en 'activa' sin cuota por el bug.

create or replace function public.aprobar_matricula(
  p_inscripcion_id     uuid,
  p_monto_mensual      numeric,
  p_dia_cobro          smallint default 5,
  p_motivo_ajuste      text default null,
  p_monto_primer_mes   numeric default null
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_estudiante    uuid;
  v_insc_estado   text;
  v_responsable   uuid;
  v_fnac          date;
  v_acuerdo_id    uuid;
  v_mes_actual    date := date_trunc('month', current_date)::date;
  v_monto_inicial numeric(10,2);
  v_vencimiento   date;
  v_dia           smallint := coalesce(p_dia_cobro, 5);
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede aprobar matrículas';
  end if;
  if p_monto_mensual is null or p_monto_mensual <= 0 then
    raise exception 'El monto mensual debe ser mayor que cero';
  end if;
  if v_dia not between 1 and 28 then
    raise exception 'El día de cobro debe estar entre 1 y 28';
  end if;

  select i.estudiante_id, i.estado into v_estudiante, v_insc_estado
    from public.inscripciones i
   where i.id = p_inscripcion_id
   for update;

  if not found then
    raise exception 'Inscripción no encontrada o ya procesada';
  end if;

  if v_insc_estado = 'pendiente' then
    update public.inscripciones
       set estado = 'activa',
           aprobada_por = auth.uid(),
           aprobada_en = now()
     where id = p_inscripcion_id;
  elsif v_insc_estado <> 'activa' then
    raise exception 'Inscripción no encontrada o ya procesada';
  end if;
  -- Si ya estaba 'activa' (reintento tras el bug de cuota sin estudiante_id),
  -- se continúa para completar acuerdo/condición/cuota faltantes.

  select e.fecha_nacimiento into v_fnac
    from public.estudiantes e where e.id = v_estudiante;

  select er.representante_id into v_responsable
    from public.estudiante_representante er
   where er.estudiante_id = v_estudiante
   order by er.es_contacto_principal desc
   limit 1;

  if v_fnac is not null
     and v_fnac > current_date - interval '18 years'
     and v_responsable is null then
    raise exception 'El estudiante es menor de edad y requiere un representante vinculado antes de aprobar la matrícula';
  end if;

  select a.id into v_acuerdo_id
    from public.acuerdos_pago a
   where a.inscripcion_id = p_inscripcion_id
   order by a.created_at desc
   limit 1;

  if v_acuerdo_id is null then
    insert into public.acuerdos_pago
      (estudiante_id, responsable_representante_id, inscripcion_id, monto_mensual, dia_cobro, fecha_inicio, motivo_ajuste, acordado_por)
    values
      (v_estudiante, v_responsable, p_inscripcion_id, p_monto_mensual, v_dia, v_mes_actual, nullif(trim(coalesce(p_motivo_ajuste, '')), ''), auth.uid())
    returning id into v_acuerdo_id;

    insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id)
    values ('acuerdo', v_acuerdo_id, 'creado',
      jsonb_build_object('estudiante_id', v_estudiante, 'inscripcion_id', p_inscripcion_id, 'origen', 'aprobar_matricula'),
      auth.uid());
  else
    update public.acuerdos_pago
       set responsable_representante_id = coalesce(responsable_representante_id, v_responsable),
           monto_mensual = p_monto_mensual,
           dia_cobro = v_dia,
           motivo_ajuste = nullif(trim(coalesce(p_motivo_ajuste, '')), '')
     where id = v_acuerdo_id;
  end if;

  insert into public.acuerdo_condiciones(acuerdo_id, vigente_desde, monto_mensual, dia_cobro, moneda, motivo, creado_por)
  values (v_acuerdo_id, v_mes_actual, p_monto_mensual, v_dia, 'USD',
    coalesce(nullif(trim(coalesce(p_motivo_ajuste, '')), ''), 'Aprobación de matrícula'), auth.uid())
  on conflict (acuerdo_id, vigente_desde) do update
     set monto_mensual = excluded.monto_mensual,
         dia_cobro = excluded.dia_cobro,
         motivo = excluded.motivo;

  v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
  v_vencimiento := v_mes_actual + make_interval(days => v_dia - 1);
  if v_vencimiento < current_date then
    v_vencimiento := current_date + interval '3 days';
  end if;

  insert into public.cuotas
    (acuerdo_id, estudiante_id, responsable_representante_id, tipo, concepto, origen, periodo_mes, monto, fecha_vencimiento, creada_por)
  values
    (v_acuerdo_id, v_estudiante, v_responsable, 'mensualidad', 'Mensualidad', 'matricula', v_mes_actual, v_monto_inicial, v_vencimiento, auth.uid())
  on conflict (acuerdo_id, periodo_mes) where tipo = 'mensualidad' and estado <> 'anulada' do nothing;
end; $$;

grant execute on function public.aprobar_matricula(uuid, numeric, smallint, text, numeric) to authenticated;


create or replace function public.matricular_estudiante_directo(
  p_estudiante_id      uuid,
  p_catedra_id         uuid,
  p_monto_mensual      numeric,
  p_dia_cobro          smallint default 5,
  p_motivo_ajuste      text default null,
  p_monto_primer_mes   numeric default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_inscripcion_id uuid;
  v_acuerdo_id     uuid;
  v_responsable    uuid;
  v_fnac           date;
  v_mes_actual     date := date_trunc('month', current_date)::date;
  v_monto_inicial  numeric(10,2);
  v_vencimiento    date;
  v_dia            smallint := coalesce(p_dia_cobro, 5);
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede matricular estudiantes directamente';
  end if;

  select id into v_inscripcion_id
    from public.inscripciones
   where estudiante_id = p_estudiante_id
     and catedra_id = p_catedra_id
     and estado in ('activa', 'pendiente');

  if v_inscripcion_id is not null then
    raise exception 'El estudiante ya tiene una matrícula activa o pendiente en esta cátedra';
  end if;

  select e.fecha_nacimiento into v_fnac
    from public.estudiantes e where e.id = p_estudiante_id;
  if not found then
    raise exception 'Estudiante no encontrado';
  end if;

  select er.representante_id into v_responsable
    from public.estudiante_representante er
   where er.estudiante_id = p_estudiante_id
   order by er.es_contacto_principal desc
   limit 1;

  if v_fnac is not null
     and v_fnac > current_date - interval '18 years'
     and v_responsable is null then
    raise exception 'El estudiante es menor de edad y requiere un representante vinculado antes de matricularlo';
  end if;

  insert into public.inscripciones
    (estudiante_id, catedra_id, estado, fecha_inscripcion, aprobada_por, aprobada_en)
  values
    (p_estudiante_id, p_catedra_id, 'activa', current_date, auth.uid(), now())
  returning id into v_inscripcion_id;

  if p_monto_mensual is not null and p_monto_mensual > 0 then
    if v_dia not between 1 and 28 then
      raise exception 'El día de cobro debe estar entre 1 y 28';
    end if;

    insert into public.acuerdos_pago
      (estudiante_id, responsable_representante_id, inscripcion_id, monto_mensual, dia_cobro, fecha_inicio, motivo_ajuste, acordado_por)
    values
      (p_estudiante_id, v_responsable, v_inscripcion_id, p_monto_mensual, v_dia, v_mes_actual,
       nullif(trim(coalesce(p_motivo_ajuste, '')), ''), auth.uid())
    returning id into v_acuerdo_id;

    insert into public.acuerdo_condiciones(acuerdo_id, vigente_desde, monto_mensual, dia_cobro, moneda, motivo, creado_por)
    values (v_acuerdo_id, v_mes_actual, p_monto_mensual, v_dia, 'USD',
      coalesce(nullif(trim(coalesce(p_motivo_ajuste, ''))), 'Matrícula directa'), auth.uid())
    on conflict (acuerdo_id, vigente_desde) do update
       set monto_mensual = excluded.monto_mensual,
           dia_cobro = excluded.dia_cobro,
           motivo = excluded.motivo;

    v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
    v_vencimiento := v_mes_actual + make_interval(days => v_dia - 1);
    if v_vencimiento < current_date then
      v_vencimiento := current_date + interval '3 days';
    end if;

    insert into public.cuotas
      (acuerdo_id, estudiante_id, responsable_representante_id, tipo, concepto, origen, periodo_mes, monto, fecha_vencimiento, creada_por)
    values
      (v_acuerdo_id, p_estudiante_id, v_responsable, 'mensualidad', 'Mensualidad', 'matricula', v_mes_actual, v_monto_inicial, v_vencimiento, auth.uid())
    on conflict (acuerdo_id, periodo_mes) where tipo = 'mensualidad' and estado <> 'anulada' do nothing;
  end if;

  return v_inscripcion_id;
end; $$;

grant execute on function public.matricular_estudiante_directo(uuid, uuid, numeric, smallint, text, numeric) to authenticated;
