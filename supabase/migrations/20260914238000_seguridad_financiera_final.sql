-- Cierre definitivo de exposición directa y RLS del dominio financiero.

alter table public.acuerdo_condiciones enable row level security;

revoke all on public.acuerdo_condiciones, public.acuerdos_pago, public.cuotas,
  public.cobros, public.cobro_aplicaciones, public.auditoria_financiera,
  public.ejecuciones_generacion_cuotas,
  public.v_estado_cuenta, public.v_cobranza_responsables
from public, anon, authenticated;

grant select on public.acuerdo_condiciones, public.acuerdos_pago, public.cuotas,
  public.cobros, public.cobro_aplicaciones, public.auditoria_financiera,
  public.ejecuciones_generacion_cuotas,
  public.v_estado_cuenta, public.v_cobranza_responsables to authenticated;

revoke insert, update, delete on public.acuerdo_condiciones, public.acuerdos_pago,
  public.cuotas, public.cobros, public.cobro_aplicaciones,
  public.auditoria_financiera, public.ejecuciones_generacion_cuotas
from authenticated;

drop policy if exists "admin gestiona condiciones de acuerdo" on public.acuerdo_condiciones;
drop policy if exists "lectura de condiciones propias" on public.acuerdo_condiciones;
create policy "admin gestiona condiciones de acuerdo" on public.acuerdo_condiciones
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "lectura de condiciones propias" on public.acuerdo_condiciones
  for select to authenticated using (
    exists (
      select 1 from public.acuerdos_pago a
      where a.id = acuerdo_condiciones.acuerdo_id
        and a.estudiante_id in (select public.estudiantes_accesibles())
    )
  );

-- Ningún RPC de negocio financiero queda invocable por anon/PUBLIC.
do $$
declare v_sig text;
begin
  for v_sig in
    select p.oid::regprocedure::text
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'actualizar_acuerdo_administrativo','actualizar_acuerdo_completo',
        'actualizar_condiciones_acuerdo','anular_cobro','anular_cuota',
        'asignar_numero_recibo','cambiar_responsable_acuerdo','cerrar_acuerdo',
        'condonar_cuota','crear_acuerdo_pago','crear_cargo_extraordinario',
        'crear_estudiante_administrativo','desvincular_representante_estudiante',
        'editar_cuota','generar_cuotas_mes','generar_cuotas_mes_cron',
        'generar_cuotas_mes_interno','recalcular_cuota_aplicacion',
        'recalcular_cuota_desde_cobros','recalcular_cuotas_cobro',
        'registrar_cobro','reportar_cobro_portal','revisar_cobro',
        'restaurar_cuota_condonada','validar_reserva_cobro_aplicacion',
        'validar_responsable_acuerdo','validar_responsable_cuota',
        'vincular_representante_estudiante','proteger_ultimo_admin'
      )
  loop
    execute 'revoke all on function ' || v_sig || ' from public, anon';
  end loop;
end $$;

-- Helpers/triggers nunca son una superficie de API.
do $$
declare v_sig text;
begin
  for v_sig in
    select p.oid::regprocedure::text
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'asignar_numero_recibo','recalcular_cuota_aplicacion',
        'recalcular_cuota_desde_cobros','recalcular_cuotas_cobro',
        'validar_reserva_cobro_aplicacion','validar_responsable_acuerdo',
        'validar_responsable_cuota','proteger_ultimo_admin'
      )
  loop
    execute 'revoke all on function ' || v_sig || ' from authenticated';
  end loop;
end $$;

grant execute on function public.actualizar_acuerdo_administrativo(uuid,public.estado_acuerdo,date,text),
  public.actualizar_acuerdo_completo(uuid,numeric,smallint,date,public.estado_acuerdo,date,text,text),
  public.actualizar_condiciones_acuerdo(uuid,date,numeric,smallint,text),
  public.anular_cobro(uuid,text), public.anular_cuota(uuid,text),
  public.cambiar_responsable_acuerdo(uuid,uuid,text), public.cerrar_acuerdo(uuid,jsonb,text),
  public.condonar_cuota(uuid,text), public.crear_acuerdo_pago(uuid,uuid,numeric,smallint,date,date,text,text),
  public.crear_cargo_extraordinario(uuid,uuid,numeric,date,text,text),
  public.crear_estudiante_administrativo(text,text,date,text,text,text,public.nivel_curso,text,uuid,public.parentesco,uuid),
  public.editar_cuota(uuid,numeric,date,text), public.generar_cuotas_mes(date),
  public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb),
  public.reportar_cobro_portal(uuid,numeric,date,public.metodo_cobro,text,text,text),
  public.revisar_cobro(uuid,boolean,text), public.restaurar_cuota_condonada(uuid,text),
  public.desvincular_representante_estudiante(uuid,uuid),
  public.vincular_representante_estudiante(uuid,uuid,public.parentesco,boolean,boolean)
to authenticated;

drop policy if exists "responsable lee sus cobros" on public.cobros;
create policy "responsable lee sus cobros" on public.cobros
  for select to authenticated using (
    public.es_admin()
    or responsable_estudiante_id in (select public.estudiantes_accesibles())
    or exists (
      select 1 from public.estudiante_representante er
      join public.representantes r on r.id = er.representante_id
      where er.representante_id = cobros.responsable_representante_id
        and r.perfil_id = (select auth.uid())
    )
  );

create index if not exists acuerdo_condiciones_creado_por_idx on public.acuerdo_condiciones(creado_por);
create index if not exists acuerdos_pago_acordado_por_idx on public.acuerdos_pago(acordado_por);
create index if not exists acuerdos_pago_inscripcion_idx on public.acuerdos_pago(inscripcion_id);
create index if not exists acuerdos_pago_responsable_idx on public.acuerdos_pago(responsable_representante_id);
create index if not exists cobros_registrado_por_idx on public.cobros(registrado_por);
create index if not exists cobros_revisado_por_idx on public.cobros(revisado_por);
create index if not exists cobros_anulado_por_idx on public.cobros(anulado_por);
create index if not exists cobros_responsable_estudiante_idx on public.cobros(responsable_estudiante_id);
create index if not exists cobros_responsable_representante_idx on public.cobros(responsable_representante_id);
create index if not exists cuotas_creada_por_idx on public.cuotas(creada_por);
create index if not exists cuotas_anulada_por_idx on public.cuotas(anulada_por);
create index if not exists cuotas_condonada_por_idx on public.cuotas(condonada_por);
create index if not exists ejecuciones_generacion_cuotas_ejecutado_por_idx on public.ejecuciones_generacion_cuotas(ejecutado_por);
