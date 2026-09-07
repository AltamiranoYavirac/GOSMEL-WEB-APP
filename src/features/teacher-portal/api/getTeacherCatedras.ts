import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITeacherCatedra, TEstadoCatedra, TModalidadCurso } from "../model/teacher-dashboard.types";

export async function getTeacherCatedras(): Promise<{
  data: ITeacherCatedra[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const { data: rolData } = await supabase
    .from("perfil_rol")
    .select("rol")
    .eq("perfil_id", user.id);
  const isAdmin = (rolData ?? []).some((r) => r.rol === "admin");

  let query = supabase
    .from("catedras")
    .select(
      "id, codigo, curso_id, aula, cupo_maximo, modalidad, estado, cursos(nombre), catedra_horarios(dia_semana, hora_inicio, hora_fin), inscripciones!inscripciones_catedra_id_fkey(estado)"
    )
    .order("codigo", { ascending: true })
    .limit(100);

  if (!isAdmin) {
    query = query.eq("docente_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ITeacherCatedra[] = (data ?? []).map((c) => ({
    id: c.id,
    codigo: c.codigo,
    cursoId: c.curso_id,
    curso: c.cursos?.nombre ?? "Sin curso",
    modalidad: c.modalidad as TModalidadCurso,
    aula: c.aula,
    cupoMaximo: c.cupo_maximo,
    inscritos: (c.inscripciones ?? []).filter((item) => item.estado === "activa").length,
    estado: c.estado as TEstadoCatedra,
    horarios: (c.catedra_horarios ?? []).map((h) => ({
      dia: h.dia_semana,
      inicio: h.hora_inicio,
      fin: h.hora_fin,
    })),
  }));

  return { data: rows, error: null };
}
