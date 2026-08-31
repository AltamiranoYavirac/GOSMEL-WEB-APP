import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { ICrearCatedraFormValues } from "../model/CrearCatedraForm.config";

export async function crearCatedra(
  values: ICrearCatedraFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const catedra: TablesInsert<"catedras"> = {
    codigo: values.codigo.trim(),
    curso_id: values.cursoId,
    docente_id: values.docenteId,
    modalidad: values.modalidad,
    estado: values.estado,
    aula: values.aula?.trim() ? values.aula.trim() : null,
    cupo_maximo: values.cupoMaximo,
  };

  if (values.fechaInicio) {
    catedra.fecha_inicio = values.fechaInicio;
  }
  if (values.fechaFin) {
    catedra.fecha_fin = values.fechaFin;
  }

  const { data, error } = await supabase.from("catedras").insert(catedra).select("id").single();
  if (error) {
    return { data: null, error: error.message };
  }

  const diaSemana = values.diaSemana;
  const horaInicio = values.horaInicio;
  const horaFin = values.horaFin;
  if (diaSemana && horaInicio && horaFin) {
    const { error: horarioError } = await supabase.from("catedra_horarios").insert({
      catedra_id: data.id,
      dia_semana: Number(diaSemana),
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    });
    if (horarioError) {
      return { data: null, error: horarioError.message };
    }
  }

  return { data, error: null };
}