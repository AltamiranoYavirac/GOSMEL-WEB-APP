-- Las funciones internas y las APIs de compatibilidad no forman parte del contrato web.
revoke all on function public.generar_cuotas_mes_interno(date,uuid) from public, anon, authenticated;
revoke all on function public.actualizar_acuerdo_administrativo(uuid,public.estado_acuerdo,date,text) from public, anon, authenticated;
revoke all on function public.actualizar_condiciones_acuerdo(uuid,date,numeric,smallint,text) from public, anon, authenticated;
