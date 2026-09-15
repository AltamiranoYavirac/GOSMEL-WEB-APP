create sequence if not exists public.recibo_numero_seq;
create or replace function public.asignar_numero_recibo()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.estado='aprobado' and new.numero_recibo is null then new.numero_recibo:=format('REC-%s-%s',to_char(current_date,'YYYY'),lpad(nextval('public.recibo_numero_seq')::text,6,'0')); end if;
 return new;
end $$;
drop trigger if exists trg_asignar_numero_recibo on public.cobros;
create trigger trg_asignar_numero_recibo before insert or update of estado on public.cobros for each row execute function public.asignar_numero_recibo();
