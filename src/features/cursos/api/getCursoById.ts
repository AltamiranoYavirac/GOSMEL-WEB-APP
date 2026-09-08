import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICursoDetalle, TModalidadCurso, TNivelCurso } from "../model/curso.types";

export async function getCursoById(id: string): Promise<{
  data: ICursoDetalle | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cursos")
    .select(
      "id, nombre, resumen, descripcion, nivel, modalidad, duracion_semanas, horas_totales, precio_referencial, etiqueta_precio, mostrar_precio, video_intro_url, portada_public_id, publicado, destacado"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "No se pudo cargar el curso." };
  }

  const detalle: ICursoDetalle = {
    id: data.id,
    nombre: data.nombre ?? "",
    resumen: data.resumen ?? "",
    descripcion: data.descripcion ?? "",
    nivel: (data.nivel ?? "basico") as TNivelCurso,
    modalidad: (data.modalidad ?? "presencial") as TModalidadCurso,
    duracionSemanas: data.duracion_semanas ? String(data.duracion_semanas) : "",
    horasTotales: data.horas_totales ? String(data.horas_totales) : "",
    precioReferencial: data.precio_referencial ? String(data.precio_referencial) : "",
    etiquetaPrecio: data.etiqueta_precio ?? "",
    mostrarPrecio: data.mostrar_precio ?? false,
    videoIntroUrl: data.video_intro_url ?? "",
    portadaPublicId: data.portada_public_id ?? "",
    publicado: data.publicado ?? false,
    destacado: data.destacado ?? false,
  };

  return { data: detalle, error: null };
}
