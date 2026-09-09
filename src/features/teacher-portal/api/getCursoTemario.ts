import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICursoTemario } from "../model/teacher-dashboard.types";

export async function getCursoTemario(
  cursoId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ICursoTemario | null; error: string | null }> {

  const [cursoRes, modulosRes] = await Promise.all([
    supabase.from("cursos").select("id, nombre").eq("id", cursoId).maybeSingle(),
    supabase
      .from("curso_modulos")
      .select("id, titulo, descripcion, orden, curso_lecciones(id, titulo, descripcion, duracion_minutos, orden, es_muestra)")
      .eq("curso_id", cursoId)
      .order("orden", { ascending: true }),
  ]);

  if (cursoRes.error) return { data: null, error: cursoRes.error.message };
  if (modulosRes.error) return { data: null, error: modulosRes.error.message };

  if (!cursoRes.data) return { data: null, error: "Curso no encontrado" };

  const modulos = (modulosRes.data ?? []).map((m) => ({
    id: m.id,
    titulo: m.titulo,
    descripcion: m.descripcion,
    orden: m.orden,
    lecciones: (m.curso_lecciones ?? [])
      .sort((a, b) => a.orden - b.orden)
      .map((l) => ({
        id: l.id,
        titulo: l.titulo,
        descripcion: l.descripcion,
        duracionMinutos: l.duracion_minutos,
        orden: l.orden,
        esMuestra: l.es_muestra,
      })),
  }));

  return {
    data: {
      cursoId: cursoRes.data.id,
      cursoNombre: cursoRes.data.nombre,
      modulos,
    },
    error: null,
  };
}
