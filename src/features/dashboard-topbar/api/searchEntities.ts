import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISearchResults } from "../model/topbar.types";

interface ISearchEntitiesResult {
  data: ISearchResults | null;
  error: string | null;
}

export async function searchEntities(query: string): Promise<ISearchEntitiesResult> {
  const supabase = createSupabaseBrowserClient();
  const q = query.trim();

  const [estudiantes, docentes, cursos] = await Promise.all([
    supabase
      .from("estudiantes")
      .select("id, nombres, apellidos")
      .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%`)
      .limit(5),
    supabase
      .from("docentes")
      .select("perfil_id, perfiles!docentes_perfil_id_fkey!inner(nombres, apellidos)")
      .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%`, { referencedTable: "perfiles" })
      .limit(5),
    supabase.from("cursos").select("id, nombre, nivel").ilike("nombre", `%${q}%`).limit(5),
  ]);

  const firstError = [estudiantes, docentes, cursos].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  return {
    data: {
      estudiantes: (estudiantes.data ?? []).map((estudiante) => ({
        id: estudiante.id,
        label: `${estudiante.nombres} ${estudiante.apellidos}`,
        subtitle: "Estudiante",
        href: "/dashboard/admin/estudiantes",
      })),
      docentes: (docentes.data ?? []).map((docente) => ({
        id: docente.perfil_id,
        label: `${docente.perfiles?.nombres ?? ""} ${docente.perfiles?.apellidos ?? ""}`.trim(),
        subtitle: "Docente",
        href: "/dashboard/admin/docentes",
      })),
      cursos: (cursos.data ?? []).map((curso) => ({
        id: curso.id,
        label: curso.nombre,
        subtitle: curso.nivel ? `Nivel ${curso.nivel}` : "Curso",
        href: "/dashboard/admin/cursos",
      })),
    },
    error: null,
  };
}
