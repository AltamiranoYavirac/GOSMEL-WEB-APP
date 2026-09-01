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

  const { data: est, error: estError } = await supabase
    .from("estudiantes")
    .insert({
      nombres: input.nombres.trim(),
      apellidos: input.apellidos.trim(),
      fecha_nacimiento: input.fecha_nacimiento,
      cedula: input.cedula?.trim() || null,
      celular: input.celular?.trim() || null,
      email: input.email?.trim() || null,
      nivel_musical: input.nivel_musical || "iniciacion",
      biografia_corta: input.biografia_corta?.trim() || null,
      fecha_ingreso: new Date().toISOString().slice(0, 10),
      activo: true,
    })
    .select("id")
    .single();

  if (estError || !est) {
    return { data: null, error: estError?.message ?? "Error al crear estudiante" };
  }

  if (input.representante_id) {
    await supabase.from("estudiante_representante").insert({
      estudiante_id: est.id,
      representante_id: input.representante_id,
      parentesco: input.parentesco || "tutor_legal",
      es_contacto_principal: true,
      autoriza_retiro: true,
    });
  }

  if (input.instrumento_id) {
    await supabase.from("estudiante_instrumento").insert({
      estudiante_id: est.id,
      instrumento_id: input.instrumento_id,
      nivel: input.nivel_musical || "iniciacion",
    });
  }

  return { data: { id: est.id }, error: null };
}
