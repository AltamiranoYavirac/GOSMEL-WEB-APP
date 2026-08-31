import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEstudianteRow, TNivelCurso } from "../model/estudiante.types";

function calcularEdad(fechaNacimiento: string): number | null {
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumple = hoy.getMonth() < nacimiento.getMonth()
    || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (cumple) edad -= 1;
  return edad;
}

export async function getEstudiantes(): Promise<{
  data: IEstudianteRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rolesRol } = await supabase
    .from("perfil_rol")
    .select("perfil_id")
    .eq("rol", "estudiante");

  const perfilIdsConRol = (rolesRol ?? []).map((rol) => rol.perfil_id);

  const { data, error } = await supabase
    .from("estudiantes")
    .select(
      "id, perfil_id, nombres, apellidos, cedula, celular, email, fecha_nacimiento, nivel_musical, activo, estudiante_instrumento(instrumentos(nombre)), estudiante_representante(representantes(nombres, apellidos), es_contacto_principal)"
    )
    .in("perfil_id", perfilIdsConRol)
    .order("nombres", { ascending: true })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IEstudianteRow[] = (data ?? []).map((estudiante) => {
    const representantePrincipal = estudiante.estudiante_representante?.find(
      (vinculo) => vinculo.es_contacto_principal || vinculo.representantes
    )?.representantes;

    return {
      id: estudiante.id,
      perfilId: estudiante.perfil_id,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      nombreCompleto: `${estudiante.nombres} ${estudiante.apellidos}`.trim(),
      email: estudiante.email,
      cedula: estudiante.cedula,
      celular: estudiante.celular,
      edad: estudiante.fecha_nacimiento ? calcularEdad(estudiante.fecha_nacimiento) : null,
      fechaNacimiento: estudiante.fecha_nacimiento,
      nivel: estudiante.nivel_musical as TNivelCurso | null,
      instrumentos: (estudiante.estudiante_instrumento ?? [])
        .map((item) => item.instrumentos?.nombre ?? "")
        .filter(Boolean),
      representante: representantePrincipal
        ? `${representantePrincipal.nombres} ${representantePrincipal.apellidos}`.trim()
        : null,
      activo: estudiante.activo,
    };
  });

  return { data: rows, error: null };
}