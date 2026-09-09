import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ITeacherMaterial, TTipoMaterial, TVisibilidadMaterial } from "../model/teacher-dashboard.types";

export async function getTeacherMateriales(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ITeacherMaterial[] | null;
  error: string | null;
}> {
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

  let query = supabase
    .from("materiales")
    .select("id, titulo, tipo, visible_para, curso_id, catedra_id, storage_path, url_externa, subido_por, created_at, cursos(nombre), catedras(codigo)")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    const { data: catedras, error: catedrasError } = await supabase
      .from("catedras")
      .select("id, curso_id")
      .eq("docente_id", user.id);

    if (catedrasError) return { data: null, error: catedrasError.message };

    const catedraIds = (catedras ?? []).map((c) => c.id);
    const cursoIds = (catedras ?? []).map((c) => c.curso_id).filter(Boolean);

    if (catedraIds.length > 0 || cursoIds.length > 0) {
      const filters: string[] = [`subido_por.eq.${user.id}`];
      if (catedraIds.length > 0) filters.push(`catedra_id.in.(${catedraIds.join(",")})`);
      if (cursoIds.length > 0) filters.push(`curso_id.in.(${cursoIds.join(",")})`);
      query = query.or(filters.join(","));
    } else {
      query = query.eq("subido_por", user.id);
    }
  }

  const { data, error } = await query.limit(100);

  if (error) {
    return { data: null, error: error.message };
  }

  const items: ITeacherMaterial[] = (data ?? []).map((m) => {
    let destino = "General";
    if (m.catedras?.codigo) {
      destino = `Cátedra ${m.catedras.codigo}`;
    } else if (m.cursos?.nombre) {
      destino = `Curso ${m.cursos.nombre}`;
    }

    return {
      id: m.id,
      titulo: m.titulo,
      tipo: m.tipo as TTipoMaterial,
      visibilidad: m.visible_para as TVisibilidadMaterial,
      cursoId: m.curso_id,
      catedraId: m.catedra_id,
      destino,
      storagePath: m.storage_path,
      urlExterna: m.url_externa,
      subidoPor: m.subido_por,
      createdAt: m.created_at,
    };
  });

  return { data: items, error: null };
}
