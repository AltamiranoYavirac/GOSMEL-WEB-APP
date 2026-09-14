import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICatedraOptions, ICursoOption, IDocenteOption } from "../model/catedra-option.types";

export function sugerirCodigoCatedra(codigos: string[], fecha = new Date()): string {
  const prefix = `CAT-${fecha.getFullYear()}-`;
  const maximo = codigos.reduce((acc, codigo) => {
    const match = codigo.match(/^CAT-\d{4}-(\d+)$/i);
    if (!match || !codigo.toUpperCase().startsWith(prefix)) return acc;
    return Math.max(acc, Number(match[1]));
  }, 0);
  return `${prefix}${String(maximo + 1).padStart(2, "0")}`;
}

export function filtrarDocentesPorCurso(
  docentes: IDocenteOption[],
  cursos: ICursoOption[],
  cursoId: string,
  mostrarTodos = false,
  docenteActualId?: string
): IDocenteOption[] {
  const instrumentoId = cursos.find((curso) => curso.id === cursoId)?.instrumentoId ?? null;

  if (!instrumentoId || mostrarTodos) return docentes;

  const filtrados = docentes.filter((docente) => docente.instrumentoIds.includes(instrumentoId));
  if (filtrados.length === 0) return docentes;

  if (docenteActualId && !filtrados.some((docente) => docente.id === docenteActualId)) {
    const actual = docentes.find((docente) => docente.id === docenteActualId);
    if (actual) return [...filtrados, actual];
  }

  return filtrados;
}

export async function getCatedraOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICatedraOptions | null;
  error: string | null;
}> {

  const { data: rolesDocente } = await supabase
    .from("perfil_rol")
    .select("perfil_id, rol")
    .in("rol", ["docente", "admin"]);

  const docentePerfilIds = Array.from(new Set((rolesDocente ?? []).map((r) => r.perfil_id)));
  const fallbackIds = docentePerfilIds.length > 0 ? docentePerfilIds : ["00000000-0000-0000-0000-000000000000"];

  const [cursos, perfilesDocentes, catedras, docenteInstrumentos] = await Promise.all([
    supabase
      .from("cursos")
      .select("id, nombre, instrumento_id")
      .order("nombre", { ascending: true })
      .limit(300),
    supabase
      .from("perfiles")
      .select("id, nombres, apellidos")
      .in("id", fallbackIds)
      .order("nombres", { ascending: true })
      .limit(300),
    supabase.from("catedras").select("codigo").limit(1000),
    supabase
      .from("docente_instrumento")
      .select("docente_id, instrumento_id")
      .in("docente_id", fallbackIds)
      .limit(1000),
  ]);

  const firstError = [cursos, perfilesDocentes, catedras, docenteInstrumentos].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const roleMap = new Map<string, Set<string>>();
  for (const r of rolesDocente ?? []) {
    if (!roleMap.has(r.perfil_id)) roleMap.set(r.perfil_id, new Set());
    roleMap.get(r.perfil_id)?.add(r.rol);
  }

  const instrumentosPorDocente = new Map<string, string[]>();
  for (const item of docenteInstrumentos.data ?? []) {
    const lista = instrumentosPorDocente.get(item.docente_id) ?? [];
    lista.push(item.instrumento_id);
    instrumentosPorDocente.set(item.docente_id, lista);
  }

  return {
    data: {
      cursos: (cursos.data ?? []).map((curso) => ({
        id: curso.id,
        nombre: curso.nombre,
        instrumentoId: curso.instrumento_id,
      })),
      docentes: (perfilesDocentes.data ?? []).map((perfil) => {
        const roles = roleMap.get(perfil.id);
        const esAdmin = roles?.has("admin") && !roles?.has("docente");
        const nombreCompleto = `${perfil.nombres} ${perfil.apellidos}`.trim();
        return {
          id: perfil.id,
          nombre: esAdmin ? `${nombreCompleto} (Admin)` : nombreCompleto,
          instrumentoIds: instrumentosPorDocente.get(perfil.id) ?? [],
        };
      }),
      sugerenciaCodigo: sugerirCodigoCatedra((catedras.data ?? []).map((catedra) => catedra.codigo)),
    },
    error: null,
  };
}
