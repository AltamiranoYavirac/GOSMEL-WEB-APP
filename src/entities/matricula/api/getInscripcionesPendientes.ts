import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IInscripcionPendiente, TModalidadCurso, TNivelCurso } from "../model/matricula.types";

type TNombreLike = { nombres?: string | null; apellidos?: string | null } | null | undefined;

function fullName(person: TNombreLike): string | null {
  if (!person) return null;
  const name = `${person.nombres ?? ""} ${person.apellidos ?? ""}`.trim();
  return name.length > 0 ? name : null;
}

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function calcAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function calcDiasEspera(fechaInscripcion: string): number {
  const start = new Date(fechaInscripcion).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}

export async function getInscripcionesPendientes(
  catedraId?: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IInscripcionPendiente[] | null; error: string | null }> {

  let query = supabase
    .from("inscripciones")
    .select(
      "id, fecha_inscripcion, fecha_inicio, fecha_fin, solicitada_por, solicitante:perfiles!inscripciones_solicitada_por_fkey(nombres, apellidos), estudiantes(nombres, apellidos, avatar_public_id, fecha_nacimiento, nivel_musical, celular, email, estudiante_representante(es_contacto_principal, parentesco, representantes(nombres, apellidos))), catedras(codigo, aula, cupo_maximo, modalidad, fecha_fin, inscripciones(estado), docentes(perfiles(nombres, apellidos)), cursos(nombre, nivel, duracion_semanas, horas_totales, precio_referencial, horario_resumen, formato_clase, portada_public_id, instrumentos(nombre, icono)))"
    )
    .eq("estado", "pendiente")
    .order("fecha_inscripcion", { ascending: true })
    .limit(300);

  if (catedraId) {
    query = query.eq("catedra_id", catedraId);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IInscripcionPendiente[] = (data ?? []).map((inscripcion) => {
    const estudiante = asSingle(inscripcion.estudiantes);
    const catedra = asSingle(inscripcion.catedras);
    const curso = asSingle(catedra?.cursos);
    const instrumento = asSingle(curso?.instrumentos);
    const docente = asSingle(catedra?.docentes);
    const solicitante = asSingle(inscripcion.solicitante);
    const representanteLink = (estudiante?.estudiante_representante ?? []).find(
      (item) => item.es_contacto_principal
    ) ?? estudiante?.estudiante_representante?.[0];
    const representante = representanteLink?.representantes;
    const edad = calcAge(estudiante?.fecha_nacimiento ?? null);

    return {
      id: inscripcion.id,
      fechaInscripcion: inscripcion.fecha_inscripcion,
      fechaInicio: inscripcion.fecha_inicio,
      fechaFin: inscripcion.fecha_fin ?? catedra?.fecha_fin ?? null,
      estudiante: `${estudiante?.nombres ?? ""} ${estudiante?.apellidos ?? ""}`.trim(),
      estudianteAvatarPublicId: estudiante?.avatar_public_id ?? null,
      estudianteFechaNacimiento: estudiante?.fecha_nacimiento ?? null,
      estudianteNivelMusical: (estudiante?.nivel_musical as TNivelCurso | null) ?? null,
      estudianteEdad: edad,
      estudianteCelular: estudiante?.celular ?? null,
      estudianteEmail: estudiante?.email ?? null,
      esMenor: edad !== null && edad < 18,
      catedraCodigo: catedra?.codigo ?? null,
      cursoNombre: curso?.nombre ?? null,
      cursoNivel: (curso?.nivel as TNivelCurso | null) ?? null,
      modalidad: (catedra?.modalidad as TModalidadCurso | null) ?? null,
      aula: catedra?.aula ?? null,
      docenteNombre: fullName(asSingle(docente?.perfiles)),
      instrumentoNombre: instrumento?.nombre ?? null,
      instrumentoIcono: instrumento?.icono ?? null,
      precioReferencial: curso?.precio_referencial ?? null,
      horarioResumen: curso?.horario_resumen ?? null,
      formatoClase: curso?.formato_clase ?? null,
      cursoPortadaPublicId: curso?.portada_public_id ?? null,
      cupoMaximo: catedra?.cupo_maximo ?? null,
      cuposOcupados: (catedra?.inscripciones ?? []).filter((item) => item.estado === "activa").length,
      duracionSemanas: curso?.duracion_semanas ?? null,
      horasTotales: curso?.horas_totales ?? null,
      diasEspera: calcDiasEspera(inscripcion.fecha_inscripcion),
      solicitadaPorNombre: fullName(solicitante),
      representante: representante
        ? {
            nombre: `${representante.nombres ?? ""} ${representante.apellidos ?? ""}`.trim(),
            parentesco: representanteLink?.parentesco ?? "Representante",
          }
        : null,
      desdeSolicitud: Boolean(inscripcion.solicitada_por),
    };
  });

  return { data: rows, error: null };
}
