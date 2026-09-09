import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { UsuariosList } from "@/features/usuarios";
import { usuariosListQuery } from "@/features/usuarios/server";

export default async function UsuariosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[usuariosListQuery(supabase)]}>
      <UsuariosList />
    </HydrateQuery>
  );
}
