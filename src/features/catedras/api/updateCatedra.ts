import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import { ensureDocenteRecord } from "@/shared/api/ensureDocenteRecord";
import type { TEstadoCatedra, TModalidadCurso } from "../model/catedra.types";

export interface IUpdateCatedraInput {
  id: string;
  cupo_maximo?: number;
  aula?: string | null;
  modalidad?: TModalidadCurso;
  docente_id?: string;
  estado?: TEstadoCatedra;
}

export async function updateCatedra(input: IUpdateCatedraInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  if (input.docente_id) {
    await ensureDocenteRecord(supabase, input.docente_id);
  }

  const { error } = await supabase
    .from("catedras")
    .update({
      cupo_maximo: input.cupo_maximo,
      aula: input.aula?.trim() || null,
      modalidad: input.modalidad,
      docente_id: input.docente_id,
      estado: input.estado,
    })
    .eq("id", input.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
