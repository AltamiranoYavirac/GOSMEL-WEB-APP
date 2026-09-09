import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { CertificadosList } from "@/features/certificados";
import { certificadosListQuery } from "@/features/certificados/server";

export default async function CertificadosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[certificadosListQuery(supabase)]}>
      <CertificadosList />
    </HydrateQuery>
  );
}
