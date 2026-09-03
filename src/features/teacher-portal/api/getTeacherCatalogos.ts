import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITeacherCatalogos } from "../model/teacher-dashboard.types";

export async function getTeacherCatalogos(): Promise<{
  data: ITeacherCatalogos | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const { data: rolData } = await supabase
    .from("perfil_rol")
    .select("rol")
    .eq("perfil_id", user.id);
  const isAdmin = (rolData ?? []).some((r) => r.rol === "admin");

  let catedrasQuery = supabase
    .from("catedras")
    .select("id, codigo, cursos(nombre)")
    .in("estado", ["planificada", "en_curso"])
    .order("codigo", { ascending: true });

  if (!isAdmin) {
    catedrasQuery = catedrasQuery.eq("docente_id", user.id);
  }

  const [catedrasRes, instrumentosRes] = await Promise.all([
    catedrasQuery,
    supabase
      .from("instrumentos")
      .select("id, nombre")
      .eq("activo", true)
      .order("nombre", { ascending: true }),
  ]);

  if (catedrasRes.error) return { data: null, error: catedrasRes.error.message };
  if (instrumentosRes.error) return { data: null, error: instrumentosRes.error.message };

  const catedras = (catedrasRes.data ?? []).map((c) => ({
    id: c.id,
    codigo: c.codigo,
    cursoNombre: c.cursos?.nombre ?? "Sin curso",
  }));

  const instrumentos = (instrumentosRes.data ?? []).map((i) => ({
    id: i.id,
    nombre: i.nombre,
  }));

  return {
    data: {
      catedras,
      instrumentos,
    },
    error: null,
  };
}
