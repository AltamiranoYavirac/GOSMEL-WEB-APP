import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICrearMatriculaFormValues, TParentesco } from "../model/CrearMatriculaForm.config";

export async function crearMatricula(
  solicitudId: string,
  values: ICrearMatriculaFormValues
): Promise<{ data: string | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const args: {
    p_nombres: string;
    p_apellidos: string;
    p_fecha_nacimiento: string;
    p_catedra_id: string;
    p_para_menor: boolean;
    p_parentesco?: TParentesco;
  } = {
    p_nombres: values.nombres.trim(),
    p_apellidos: values.apellidos.trim(),
    p_fecha_nacimiento: values.fechaNacimiento,
    p_catedra_id: values.catedraId,
    p_para_menor: values.paraMenor,
  };

  if (values.paraMenor) {
    args.p_parentesco = values.parentesco;
  }

  const { data, error } = await supabase.rpc("solicitar_matricula", args);
  if (error) {
    return { data: null, error: error.message };
  }

  const { error: estadoError } = await supabase
    .from("solicitudes")
    .update({ estado: "convertida" })
    .eq("id", solicitudId);

  if (estadoError) {
    return { data: null, error: estadoError.message };
  }

  return { data, error: null };
}