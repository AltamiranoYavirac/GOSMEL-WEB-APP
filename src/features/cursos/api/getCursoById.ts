import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type {
  ICursoDetalle,
  TCategoriaCurso,
  TModalidadCurso,
  TNivelCurso,
} from "../model/curso.types";

export async function getCursoById(
  id: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ICursoDetalle | null; error: string | null }> {
  const { data, error } = await supabase
    .from("cursos")
    .select("id, nombre, resumen, descripcion, instrumento_id, categoria, nivel, modalidad, duracion_semanas, horas_totales, precio_referencial, etiqueta_precio, mostrar_precio, portada_public_id, portada_texto_alt, publico_edad, publico_nivel, formato_clase, horario_resumen, cierre_etapa, cta_titulo, cta_descripcion, cta_primario_texto, cta_secundario_texto, publicado, orden")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "No se pudo cargar el curso." };
  }

  return {
    data: {
      id: data.id,
      nombre: data.nombre,
      resumen: data.resumen ?? "",
      descripcion: data.descripcion,
      instrumentoId: data.instrumento_id ?? "",
      categoria: (data.categoria ?? "otro") as TCategoriaCurso,
      nivel: (data.nivel ?? "basico") as TNivelCurso,
      modalidad: (data.modalidad ?? "presencial") as TModalidadCurso,
      duracionSemanas: data.duracion_semanas ? String(data.duracion_semanas) : "",
      horasTotales: data.horas_totales ? String(data.horas_totales) : "",
      precioReferencial: data.precio_referencial ? String(data.precio_referencial) : "",
      etiquetaPrecio: data.etiqueta_precio ?? "",
      mostrarPrecio: data.mostrar_precio ?? false,
      portadaPublicId: data.portada_public_id ?? "",
      portadaTextoAlt: data.portada_texto_alt ?? "",
      publicoEdad: data.publico_edad ?? "",
      publicoNivel: data.publico_nivel ?? "",
      formatoClase: data.formato_clase ?? "",
      horarioResumen: data.horario_resumen ?? "",
      cierreEtapa: data.cierre_etapa ?? "",
      ctaTitulo: data.cta_titulo ?? "",
      ctaDescripcion: data.cta_descripcion ?? "",
      ctaPrimarioTexto: data.cta_primario_texto ?? "",
      ctaSecundarioTexto: data.cta_secundario_texto ?? "",
      publicado: data.publicado,
      orden: data.orden ?? 0,
    },
    error: null,
  };
}
