import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TNivelCurso } from "../model/AsignarEstudianteForm.config";

export interface IAsignarEstudiantePayload {
  cedula: string | null;
  fechaNacimiento: string;
  nivel: TNivelCurso | null;
}

function dividirNombre(nombre: string): { nombres: string; apellidos: string } {
  const parts = nombre.trim().split(/\s+/);
  const apellidos = parts.length > 1 ? parts.slice(-1)[0] : "";
  const nombres = parts.slice(0, -1).join(" ") || nombre.trim();
  return { nombres, apellidos };
}

export async function asignarEstudiante(
  perfilId: string,
  nombre: string,
  values: IAsignarEstudiantePayload
): Promise<{ data: { perfilId: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: fichaExistente } = await supabase
    .from("estudiantes")
    .select("id")
    .eq("perfil_id", perfilId)
    .maybeSingle();

  if (!fichaExistente) {
    let fichaVincular: { id: string } | null = null;

    if (values.cedula) {
      const { data: fichaPorCedula } = await supabase
        .from("estudiantes")
        .select("id")
        .eq("cedula", values.cedula)
        .is("perfil_id", null)
        .maybeSingle();
      fichaVincular = fichaPorCedula;
    }

    if (fichaVincular) {
      const { error: linkError } = await supabase
        .from("estudiantes")
        .update({ perfil_id: perfilId })
        .eq("id", fichaVincular.id);
      if (linkError) return { data: null, error: linkError.message };
    } else {
      const { nombres, apellidos } = dividirNombre(nombre);
      const { error: fichaError } = await supabase.from("estudiantes").insert({
        perfil_id: perfilId,
        nombres,
        apellidos,
        fecha_nacimiento: values.fechaNacimiento,
        nivel_musical: values.nivel,
        activo: true,
      });
      if (fichaError) return { data: null, error: fichaError.message };
    }
  }

  const { data: rolExistente } = await supabase
    .from("perfil_rol")
    .select("perfil_id")
    .eq("perfil_id", perfilId)
    .eq("rol", "estudiante")
    .maybeSingle();

  if (!rolExistente) {
    const { error: rolError } = await supabase.from("perfil_rol").insert({
      perfil_id: perfilId,
      rol: "estudiante",
      asignado_por: user?.id ?? null,
    });
    if (rolError) return { data: null, error: rolError.message };
  }

  return { data: { perfilId }, error: null };
}