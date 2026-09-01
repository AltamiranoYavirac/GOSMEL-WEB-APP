import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function asignarRolDocente(
  perfilId: string,
  nombre: string
): Promise<{ data: { perfilId: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [rolExistente, docenteExistente] = await Promise.all([
    supabase
      .from("perfil_rol")
      .select("perfil_id")
      .eq("perfil_id", perfilId)
      .eq("rol", "docente")
      .maybeSingle(),
    supabase.from("docentes").select("perfil_id").eq("perfil_id", perfilId).maybeSingle(),
  ]);

  if (rolExistente.error) return { data: null, error: rolExistente.error.message };
  if (docenteExistente.error) return { data: null, error: docenteExistente.error.message };

  if (!docenteExistente.data) {
    const slugBase = slugify(nombre) || "docente";
    const { error: docenteError } = await supabase.from("docentes").insert({
      perfil_id: perfilId,
      slug: `${slugBase}-${perfilId.slice(0, 6)}`,
    });
    if (docenteError) return { data: null, error: docenteError.message };
  }

  if (!rolExistente.data) {
    const { error: rolError } = await supabase.from("perfil_rol").insert({
      perfil_id: perfilId,
      rol: "docente",
      asignado_por: user?.id ?? null,
    });
    if (rolError) return { data: null, error: rolError.message };
  }

  return { data: { perfilId }, error: null };
}