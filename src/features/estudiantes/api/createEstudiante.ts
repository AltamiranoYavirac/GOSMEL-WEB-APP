import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TNivelCurso } from "../model/estudiante.types";

export interface ICreateEstudianteInput {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  cedula?: string;
  celular?: string;
  email?: string;
  nivel_musical?: TNivelCurso;
  biografia_corta?: string;
  representante_id?: string;
  parentesco?: "madre" | "padre" | "abuelo" | "tio" | "hermano" | "tutor_legal" | "otro";
  instrumento_id?: string;
}

export async function createEstudiante(input: ICreateEstudianteInput): Promise<{
  data: { id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc("crear_estudiante_administrativo" as never, {
    p_nombres: input.nombres, p_apellidos: input.apellidos, p_fecha_nacimiento: input.fecha_nacimiento,
    p_cedula: input.cedula ?? null, p_celular: input.celular ?? null, p_email: input.email ?? null,
    p_nivel_musical: input.nivel_musical ?? "iniciacion", p_biografia_corta: input.biografia_corta ?? null,
    p_representante_id: input.representante_id ?? null, p_parentesco: input.parentesco ?? null,
    p_instrumento_id: input.instrumento_id ?? null,
  } as never);
  return error ? { data: null, error: error.message } : { data: data ? { id: data as string } : null, error: null };
}
