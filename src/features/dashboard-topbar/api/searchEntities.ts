import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISearchResults } from "../model/topbar.types";

interface ISearchEntitiesResult {
  data: ISearchResults | null;
  error: string | null;
}

export async function searchEntities(query: string): Promise<ISearchEntitiesResult> {
  const supabase = createSupabaseBrowserClient();
  const q = query.trim();

  const [estudiantes, cursos] = await Promise.all([
    supabase
      .from("estudiantes")
      .select("id, nombres, apellidos")
      .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%`)
      .limit(5),
    supabase.from("cursos").select("id, nombre, nivel").ilike("nombre", `%${q}%`).limit(5),
  ]);

  const firstError = [estudiantes, cursos].map((result) => result.error).find(Boolean);
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
