-- Las funciones trigger se ejecutan por PostgreSQL; no deben poder invocarse
-- mediante RPC ni por ningún rol de cliente.
revoke execute on function public.proteger_ultimo_admin_activo() from public, anon, authenticated;
