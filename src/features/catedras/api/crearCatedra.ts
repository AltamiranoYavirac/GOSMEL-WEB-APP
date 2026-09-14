import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Json } from "@/shared/api/supabase/database.types";

import type { ICrearCatedraFormValues } from "../model/CrearCatedraForm.config";

export async function crearCatedra(
  values: ICrearCatedraFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const catedra = {
    codigo: values.codigo.trim(),
    curso_id: values.cursoId,
    docente_id: values.docenteId,
    modalidad: values.modalidad,
    estado: values.estado,
    aula: values.aula?.trim() || null,
    cupo_maximo: values.cupoMaximo,
    fecha_inicio: values.fechaInicio || null,
    fecha_fin: values.fechaFin || null,
  };
  const horario = values.diaSemana && values.horaInicio && values.horaFin
    ? {
        dia_semana: Number(values.diaSemana),
        hora_inicio: values.horaInicio,
        hora_fin: values.horaFin,
      }
    : null;
  const { data, error } = await supabase.rpc("crear_catedra_con_horario", {
    p_catedra: catedra as Json,
    p_horario: horario,
  });

  if (error || !data) {
    const message = error?.message ?? "No se pudo crear la cátedra.";
    if (message.includes("catedras_codigo_key") || message.includes("duplicate key")) {
      return { data: null, error: "Ya existe una cátedra con ese código." };
    }
    return { data: null, error: message };
  }

  return { data: { id: data }, error: null };
}
