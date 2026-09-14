import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITestimonioOptions } from "../model/testimonio.types";

export async function getTestimonioOptions(): Promise<{
  data: ITestimonioOptions | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const [cursos, docentes] = await Promise.all([
    supabase.from("cursos").select("id, nombre").order("nombre"),
    supabase
      .from("docentes")
      .select("perfil_id, perfiles!docentes_perfil_id_fkey(nombres, apellidos)")
      .order("perfiles(nombres)"),
  ]);

  const firstError = cursos.error ?? docentes.error;
  if (firstError) return { data: null, error: firstError.message };

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
