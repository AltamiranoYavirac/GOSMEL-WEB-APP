import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentCertificado } from "../model/student-dashboard.types";

export async function getStudentCertificates(estudianteId: string): Promise<{
  data: IStudentCertificado[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("certificados")
    .select(
      "id, codigo_verificacion, fecha_emision, storage_path, inscripciones(estudiantes!inscripciones_estudiante_id_fkey(id), catedras!inscripciones_catedra_id_fkey(codigo, cursos(nombre)))"
    )
    .eq("inscripciones.estudiante_id", estudianteId)
    .order("fecha_emision", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IStudentCertificado[] = (data ?? []).map((certificado) => ({
    id: certificado.id,
    codigoVerificacion: certificado.codigo_verificacion ?? "",
    fechaEmision: certificado.fecha_emision ?? "",
    storagePath: certificado.storage_path ?? "",
    curso: certificado.inscripciones?.catedras?.cursos?.nombre ?? "Curso",
    catedra: certificado.inscripciones?.catedras?.codigo ?? "—",
  }));

  return { data: rows, error: null };
}