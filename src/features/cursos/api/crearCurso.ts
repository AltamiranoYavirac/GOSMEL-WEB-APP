import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { ICrearCursoFormValues } from "../model/CrearCursoForm.config";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generarSlugUnico(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  base: string
): Promise<string> {
  let slug = base;
  let intento = 1;

  while (true) {
    const { data } = await supabase.from("cursos").select("slug").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    intento += 1;
    slug = `${base}-${intento}`;
  }
}

export async function crearCurso(
  values: ICrearCursoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const base = slugify(values.nombre) || "curso";
  const slug = await generarSlugUnico(supabase, base);

  const curso: TablesInsert<"cursos"> = {
    nombre: values.nombre.trim(),
    slug,
    descripcion: values.descripcion,
    nivel: values.nivel,
    modalidad: values.modalidad,
    publicado: values.publicado,
    destacado: values.destacado,
  };

  if (values.resumen?.trim()) curso.resumen = values.resumen.trim();
  if (values.instrumentoId) curso.instrumento_id = values.instrumentoId;
  if (values.duracionSemanas != null) curso.duracion_semanas = values.duracionSemanas;
  if (values.horasTotales != null) curso.horas_totales = values.horasTotales;

  const { data, error } = await supabase.from("cursos").insert(curso).select("id").single();
  if (error) {
    return { data: null, error: error.message };
  }

  if (values.asignarDocente && values.docenteId) {
    const prefix = slugify(values.nombre).slice(0, 5).toUpperCase() || "CAT";
    const catedra: TablesInsert<"catedras"> = {
      codigo: `${prefix}-${data.id.slice(0, 5).toUpperCase()}`,
      curso_id: data.id,
      docente_id: values.docenteId,
      modalidad: values.modalidad,
      aula: values.aula?.trim() ? values.aula.trim() : null,
      cupo_maximo: values.cupoMaximo,
    };

    const { error: catedraError } = await supabase.from("catedras").insert(catedra);
    if (catedraError) {
      return { data: null, error: catedraError.message };
    }
  }

  return { data, error: null };
}