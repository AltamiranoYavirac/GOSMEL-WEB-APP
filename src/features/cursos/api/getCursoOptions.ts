import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IDocenteOption, IInstrumentoOption } from "../model/CrearCursoForm.config";

export async function getCursoOptions(): Promise<{
  data: { instrumentos: IInstrumentoOption[]; docentes: IDocenteOption[] } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const [instrumentos, docentes] = await Promise.all([
    supabase.from("instrumentos").select("id, nombre").eq("activo", true).order("nombre", { ascending: true }).limit(300),
    supabase
      .from("docentes")
      .select("perfil_id, perfiles!docentes_perfil_id_fkey(nombres, apellidos)")
      .order("perfiles(nombres)", { ascending: true })
      .limit(300),
  ]);

  const firstError = [instrumentos, docentes].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  return {
    data: {
      instrumentos: (instrumentos.data ?? []).map((instrumento) => ({
        id: instrumento.id,
        nombre: instrumento.nombre,
      })),
      docentes: (docentes.data ?? []).map((docente) => ({
        id: docente.perfil_id,
        nombre: `${docente.perfiles?.nombres ?? ""} ${docente.perfiles?.apellidos ?? ""}`.trim(),
      })),
    },
    error: null,
  };
}