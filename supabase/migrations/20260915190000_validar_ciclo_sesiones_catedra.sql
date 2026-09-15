create or replace function public.generar_sesiones_catedra(
  p_catedra_id  uuid,
  p_fecha_desde date,
  p_fecha_hasta date
) returns int language plpgsql security definer set search_path = '' as $$
declare
  v_generadas int := 0;
  v_fecha     date;
  v_dow       smallint;
  v_horario   record;
  v_inicio    date;
  v_fin       date;
begin
  if not (public.es_admin() or exists (
    select 1 from public.catedras c where c.id = p_catedra_id and c.docente_id = auth.uid()
  )) then
    raise exception 'No tiene permisos para generar sesiones en esta cátedra';
  end if;

  if p_fecha_hasta < p_fecha_desde then
    raise exception 'La fecha final no puede ser menor a la fecha inicial';
  end if;

  select c.fecha_inicio, c.fecha_fin into v_inicio, v_fin
    from public.catedras c
   where c.id = p_catedra_id;

  if not found then
    raise exception 'Cátedra no encontrada';
  end if;

  if p_fecha_desde < v_inicio then
    raise exception 'La fecha de inicio no puede ser anterior al inicio del ciclo (%)', v_inicio;
  end if;

  if v_fin is not null and p_fecha_hasta > v_fin then
    raise exception 'La fecha de fin no puede ser posterior al fin del ciclo (%)', v_fin;
  end if;

  for v_fecha in select generate_series(p_fecha_desde, p_fecha_hasta, interval '1 day')::date loop
    v_dow := extract(dow from v_fecha)::smallint;

    for v_horario in
      select hora_inicio, hora_fin
        from public.catedra_horarios
       where catedra_id = p_catedra_id and dia_semana = v_dow
    loop
      insert into public.sesiones (catedra_id, fecha, hora_inicio, hora_fin, estado)
      values (p_catedra_id, v_fecha, v_horario.hora_inicio, v_horario.hora_fin, 'programada')
      on conflict (catedra_id, fecha, hora_inicio) do nothing;

      if found then
        v_generadas := v_generadas + 1;
      end if;
    end loop;
  end loop;

  return v_generadas;
end; $$;

grant execute on function public.generar_sesiones_catedra(uuid, date, date) to authenticated;
