import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IMaterialRow, TTipoMaterial, TVisibilidadMaterial } from "../model/material.types";

export async function getMateriales(): Promise<{
  data: IMaterialRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("materiales")
    .select(
      "id, titulo, tipo, visible_para, storage_path, url_externa, curso_id, cursos(nombre), catedra_id, catedras(codigo, cursos(nombre)), subido_por, perfiles!materiales_subido_por_fkey(nombres, apellidos)"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IMaterialRow[] = (data ?? []).map((material) => {
    const catedra = material.catedras;
    const destino = material.cursos?.nombre ?? (catedra ? `${catedra.codigo} · ${catedra.cursos?.nombre ?? ""}`.trim() : null);
    const subidoPor = material.perfiles
      ? `${material.perfiles.nombres} ${material.perfiles.apellidos}`.trim()
      : null;

    return {
      id: material.id,
      titulo: material.titulo,
      tipo: material.tipo as TTipoMaterial,
      visibilidad: material.visible_para as TVisibilidadMaterial,
      destino,
      subidoPor,
      storagePath: material.storage_path,
      urlExterna: material.url_externa,
    };
  });

  return { data: rows, error: null };
}