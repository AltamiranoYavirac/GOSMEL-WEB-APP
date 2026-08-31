import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IDocenteOption, ICursoOption } from "../model/CrearCatedraForm.config";

export async function getCatedraOptions(): Promise<{
  data: { cursos: ICursoOption[]; docentes: IDocenteOption[] } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const [cursos, docentes] = await Promise.all([
    supabase.from("cursos").select("id, nombre").order("nombre", { ascending: true }).limit(300),
    supabase
      .from("docentes")
      .select("perfil_id, perfiles!docentes_perfil_id_fkey(nombres, apellidos)")
      .order("perfiles(nombres)", { ascending: true })
      .limit(300),
  ]);

  const firstError = [cursos, docentes].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  return {
    data: {
      cursos: (cursos.data ?? []).map((curso) => ({ id: curso.id, nombre: curso.nombre })),
      docentes: (docentes.data ?? []).map((docente) => ({
        id: docente.perfil_id,
        nombre: `${docente.perfiles?.nombres ?? ""} ${docente.perfiles?.apellidos ?? ""}`.trim(),
      })),
    },
    error: null,
  };
}