create policy "el estudiante edita su propio perfil"
on public.estudiantes
for update
using (perfil_id = auth.uid())
with check (perfil_id = auth.uid());

create policy "el representante edita su propio perfil"
on public.representantes
for update
using (perfil_id = auth.uid())
with check (perfil_id = auth.uid());
