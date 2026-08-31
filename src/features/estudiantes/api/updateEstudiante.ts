import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEditarEstudianteFormValues, TNivelCurso } from "../model/EditarEstudianteForm.config";

export async function updateEstudiante(
  id: string,
  values: IEditarEstudianteFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("estudiantes")
    .update({
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      cedula: values.cedula?.trim() || null,
      celular: values.celular?.trim() || null,
      email: values.email?.trim() || null,
      fecha_nacimiento: values.fechaNacimiento,
      nivel_musical: (values.nivel || null) as TNivelCurso | null,
      activo: values.activo,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}