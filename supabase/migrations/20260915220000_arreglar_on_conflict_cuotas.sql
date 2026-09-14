create unique index if not exists cuotas_mensualidad_unica
  on public.cuotas using btree (acuerdo_id, periodo_mes)
  where tipo = 'mensualidad' and estado <> 'anulada';

alter table public.cuotas drop constraint if exists cuotas_acuerdo_id_periodo_mes_key;

create or replace function public.aprobar_matricula(
  p_inscripcion_id uuid,
  p_monto_mensual numeric,
  p_dia_cobro smallint default 5,
  p_motivo_ajuste text default null,
  p_monto_primer_mes numeric default null
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_estudiante    uuid;
  v_acuerdo_id    uuid;
  v_mes_actual    date := date_trunc('month', current_date)::date;
  v_monto_inicial numeric(10,2);
  v_vencimiento   date;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede aprobar matrículas';
  end if;

  update public.inscripciones
     set estado = 'activa',
         aprobada_por = auth.uid(),
         aprobada_en = now()
   where id = p_inscripcion_id and estado = 'pendiente'
   returning estudiante_id into v_estudiante;

  if v_estudiante is null then
    raise exception 'Inscripción no encontrada o ya procesada';
  end if;

  insert into public.acuerdos_pago
    (estudiante_id, inscripcion_id, monto_mensual, dia_cobro, motivo_ajuste, acordado_por)
  values
    (v_estudiante, p_inscripcion_id, p_monto_mensual, coalesce(p_dia_cobro, 5), p_motivo_ajuste, auth.uid())
  returning id into v_acuerdo_id;

  v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
  v_vencimiento := v_mes_actual + make_interval(days => coalesce(p_dia_cobro, 5) - 1);
  if v_vencimiento < current_date then
    v_vencimiento := current_date + interval '3 days';
  end if;

  insert into public.cuotas (acuerdo_id, periodo_mes, monto, fecha_vencimiento)
  values (v_acuerdo_id, v_mes_actual, v_monto_inicial, v_vencimiento)
  on conflict (acuerdo_id, periodo_mes) where tipo = 'mensualidad' and estado <> 'anulada' do nothing;
end; $$;

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
  v_mes_actual     date := date_trunc('month', current_date)::date;
  v_monto_inicial  numeric(10,2);
  v_vencimiento    date;
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

  insert into public.inscripciones
    (estudiante_id, catedra_id, estado, fecha_inscripcion, aprobada_por, aprobada_en)
  values
    (p_estudiante_id, p_catedra_id, 'activa', current_date, auth.uid(), now())
  returning id into v_inscripcion_id;

  if p_monto_mensual is not null and p_monto_mensual > 0 then
    insert into public.acuerdos_pago
      (estudiante_id, inscripcion_id, monto_mensual, dia_cobro, motivo_ajuste, acordado_por)
    values
      (p_estudiante_id, v_inscripcion_id, p_monto_mensual, coalesce(p_dia_cobro, 5), p_motivo_ajuste, auth.uid())
    returning id into v_acuerdo_id;

    v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
    v_vencimiento := v_mes_actual + make_interval(days => coalesce(p_dia_cobro, 5) - 1);
    if v_vencimiento < current_date then
      v_vencimiento := current_date + interval '3 days';
    end if;

    insert into public.cuotas (acuerdo_id, periodo_mes, monto, fecha_vencimiento)
    values (v_acuerdo_id, v_mes_actual, v_monto_inicial, v_vencimiento)
    on conflict (acuerdo_id, periodo_mes) where tipo = 'mensualidad' and estado <> 'anulada' do nothing;
  end if;

  return v_inscripcion_id;
end; $$;

grant execute on function public.aprobar_matricula(uuid, numeric, smallint, text, numeric) to authenticated;
grant execute on function public.matricular_estudiante_directo(uuid, uuid, numeric, smallint, text, numeric) to authenticated;
