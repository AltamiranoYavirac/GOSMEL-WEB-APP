import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentMaterial, TTipoMaterial } from "../model/student-dashboard.types";

export async function getStudentMaterials(estudianteId: string): Promise<{
  data: IStudentMaterial[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("catedra_id, catedras!inscripciones_catedra_id_fkey(curso_id)")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  const catedraIds = (inscripciones ?? []).map((item) => item.catedra_id);
  const cursoIds = [...new Set((inscripciones ?? []).map((item) => item.catedras?.curso_id).filter(Boolean))];

  if (catedraIds.length === 0 && cursoIds.length === 0) {
    return { data: [], error: null };
  }

  const filtros: string[] = [];
  if (catedraIds.length > 0) filtros.push(`catedra_id.in.(${catedraIds.join(",")})`);
  if (cursoIds.length > 0) filtros.push(`curso_id.in.(${cursoIds.join(",")})`);

  const { data, error } = await supabase
    .from("materiales")
    .select("id, titulo, tipo, storage_path, url_externa, catedra_id, curso_id, catedras(codigo), cursos(nombre)")
    .or(filtros.join(","))
    .in("visible_para", ["publico", "registrados", "inscritos"])
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IStudentMaterial[] = (data ?? []).map((material) => {
    const storageHref = material.storage_path
      ? material.storage_path.startsWith("http")
        ? material.storage_path
        : `/api/storage?path=${encodeURIComponent(material.storage_path)}`
      : null;

    return {
      id: material.id,
      titulo: material.titulo,
      tipo: material.tipo as TTipoMaterial,
      href: material.url_externa ?? storageHref ?? "",
      destino: material.catedras?.codigo ?? material.cursos?.nombre ?? null,
    };
  });

  return { data: rows, error: null };
}