import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ITestimonioRow } from "../model/testimonio.types";

export async function getTestimonios(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ITestimonioRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("testimonios")
    .select(
      "id, autor_nombre, autor_rol, cita, puntuacion, foto_public_id, curso_id, cursos(nombre), docente_id, docentes!testimonios_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), orden, publicado"
    )
    .order("orden", { ascending: true })
    .limit(200);

  if (error) return { data: null, error: error.message };
  return {
    data: (data ?? []).map((item) => {
      const docente = item.docentes?.perfiles;

      return {
        id: item.id,
        autor: item.autor_nombre,
        rol: item.autor_rol,
        cita: item.cita,
        puntuacion: item.puntuacion,
        fotoPublicId: item.foto_public_id,
        cursoId: item.curso_id,
        curso: item.cursos?.nombre ?? null,
        docenteId: item.docente_id,
        docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
        orden: item.orden,
        publicado: item.publicado,
      };
    }),
    error: null,
  };
}
