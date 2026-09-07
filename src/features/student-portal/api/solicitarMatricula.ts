import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ISolicitarMatriculaInput {
  catedraId: string;
  paraMenor: boolean;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  parentesco?: string;
}

export async function solicitarMatricula(input: ISolicitarMatriculaInput): Promise<{
  data: { inscripcionId: string | null } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const args = {
    p_catedra_id: input.catedraId,
    p_para_menor: input.paraMenor,
    p_nombres: input.nombres?.trim() || null,
    p_apellidos: input.apellidos?.trim() || null,
    p_fecha_nacimiento: input.fechaNacimiento || null,
    p_parentesco: input.parentesco || null,
  } as unknown as Parameters<typeof supabase.rpc<"solicitar_matricula">>[1];

  const { data, error } = await supabase.rpc("solicitar_matricula", args);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { inscripcionId: data ?? null }, error: null };
}