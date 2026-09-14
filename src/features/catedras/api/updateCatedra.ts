import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import { ensureDocenteRecord } from "@/entities/docente";
import type { TEstadoCatedra, TModalidadCurso } from "../model/catedra.types";

export interface IUpdateCatedraInput {
  id: string;
  codigo: string;
  curso_id: string;
  docente_id: string;
  cupo_maximo: number;
  aula?: string | null;
  modalidad: TModalidadCurso;
  estado: TEstadoCatedra;
  fecha_inicio: string;
  fecha_fin?: string | null;
}

export async function updateCatedra(input: IUpdateCatedraInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  if (input.docente_id) {
    const docente = await ensureDocenteRecord(supabase, input.docente_id);
    if (docente.error) return { error: docente.error };
  }

  const { error } = await supabase
    .from("catedras")
    .update({
      codigo: input.codigo.trim(),
      curso_id: input.curso_id,
      docente_id: input.docente_id,
      cupo_maximo: input.cupo_maximo,
      aula: input.aula?.trim() || null,
      modalidad: input.modalidad,
      estado: input.estado,
      fecha_inicio: input.fecha_inicio,
      fecha_fin: input.fecha_fin || null,
    })
    .eq("id", input.id);

  if (error) {
    if (error.message.includes("catedras_codigo_key") || error.message.includes("duplicate key")) {
      return { error: "Ya existe otra cátedra con ese código." };
    }
    return { error: error.message };
  }

  return { error: null };
}
