import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICertificadoRow } from "../model/certificado.types";

export async function getCertificados(): Promise<{
  data: ICertificadoRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("certificados")
    .select(
      "id, inscripcion_id, codigo_verificacion, fecha_emision, storage_path, inscripciones(progreso_pct, estudiantes(nombres, apellidos), catedras(codigo, cursos(nombre)))"
    )
    .order("fecha_emision", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICertificadoRow[] = (data ?? []).map((c) => {
    const insc = c.inscripciones;
    const est = insc?.estudiantes;
    const cat = insc?.catedras;

    return {
      id: c.id,
      inscripcionId: c.inscripcion_id,
      codigoVerificacion: c.codigo_verificacion,
      fechaEmision: c.fecha_emision,
      storagePath: c.storage_path,
      estudiante: est ? `${est.nombres} ${est.apellidos}`.trim() : "Estudiante",
      catedra: cat?.codigo ?? "—",
      curso: cat?.cursos?.nombre ?? "—",
      progresoPct: Number(insc?.progreso_pct ?? 100),
    };
  });

  return { data: rows, error: null };
}
