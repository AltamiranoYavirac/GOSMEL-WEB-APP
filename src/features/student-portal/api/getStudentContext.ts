import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentContext, IStudentContextEstudiante, TNivelCurso } from "../model/student-dashboard.types";

export async function getStudentContext(): Promise<{
  data: IStudentContext | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const [perfil, estudiantes, claims] = await Promise.all([
    supabase.from("perfiles").select("nombres").eq("id", user.id).maybeSingle(),
    supabase
      .from("v_estudiantes")
      .select("id, nombres, apellidos, avatar_public_id, nivel_musical, es_menor, tiene_cuenta")
      .order("nombres", { ascending: true }),
    supabase.auth.getClaims(),
  ]);

  if (perfil.error || estudiantes.error || claims.error) {
    return {
      data: null,
      error: perfil.error?.message ?? estudiantes.error?.message ?? claims.error?.message ?? "Error al cargar el contexto",
    };
  }

  const roles = (claims.data?.claims?.user_roles as string[] | undefined) ?? [];

  const ids = (estudiantes.data ?? []).map((item) => item.id).filter((id): id is string => Boolean(id));
  let instrumentosPorEstudiante: Record<string, string[]> = {};

  if (ids.length > 0) {
    const { data: instrumentos, error: instError } = await supabase
      .from("estudiante_instrumento")
      .select("estudiante_id, instrumentos(nombre)")
      .in("estudiante_id", ids);

    if (instError) {
      return { data: null, error: instError.message };
    }

    instrumentosPorEstudiante = (instrumentos ?? []).reduce<Record<string, string[]>>((acc, row) => {
      const nombre = row.instrumentos?.nombre;
      if (row.estudiante_id && nombre) {
        acc[row.estudiante_id] = [...(acc[row.estudiante_id] ?? []), nombre];
      }
      return acc;
    }, {});
  }

  const lista: IStudentContextEstudiante[] = (estudiantes.data ?? [])
    .filter((item): item is typeof item & { id: string } => Boolean(item.id))
    .map((item) => ({
      id: item.id,
      nombre: `${item.nombres} ${item.apellidos}`.trim(),
      avatarPublicId: item.avatar_public_id,
      nivelMusical: item.nivel_musical as TNivelCurso | null,
      esMenor: item.es_menor ?? false,
      tieneCuenta: item.tiene_cuenta ?? false,
      instrumentos: instrumentosPorEstudiante[item.id] ?? [],
    }));

  return {
    data: {
      nombreUsuario: perfil.data?.nombres ?? "estudiante",
      estudiantes: lista,
      roles,
    },
    error: null,
  };
}