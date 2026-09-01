import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IDocenteOption, ICursoOption } from "../model/CrearCatedraForm.config";

export async function getCatedraOptions(): Promise<{
  data: { cursos: ICursoOption[]; docentes: IDocenteOption[] } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rolesDocente } = await supabase
    .from("perfil_rol")
    .select("perfil_id, rol")
    .in("rol", ["docente", "admin"]);

  const docentePerfilIds = Array.from(new Set((rolesDocente ?? []).map((r) => r.perfil_id)));

  const [cursos, perfilesDocentes] = await Promise.all([
    supabase
      .from("cursos")
      .select("id, nombre")
      .order("nombre", { ascending: true })
      .limit(300),
    supabase
      .from("perfiles")
      .select("id, nombres, apellidos")
      .in("id", docentePerfilIds.length > 0 ? docentePerfilIds : ["00000000-0000-0000-0000-000000000000"])
      .order("nombres", { ascending: true })
      .limit(300),
  ]);

  const firstError = [cursos, perfilesDocentes].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const roleMap = new Map<string, Set<string>>();
  for (const r of rolesDocente ?? []) {
    if (!roleMap.has(r.perfil_id)) roleMap.set(r.perfil_id, new Set());
    roleMap.get(r.perfil_id)?.add(r.rol);
  }

  return {
    data: {
      cursos: (cursos.data ?? []).map((curso) => ({ id: curso.id, nombre: curso.nombre })),
      docentes: (perfilesDocentes.data ?? []).map((perfil) => {
        const roles = roleMap.get(perfil.id);
        const esAdmin = roles?.has("admin") && !roles?.has("docente");
        const nombreCompleto = `${perfil.nombres} ${perfil.apellidos}`.trim();
        return {
          id: perfil.id,
          nombre: esAdmin ? `${nombreCompleto} (Admin)` : nombreCompleto,
        };
      }),
    },
    error: null,
  };
}