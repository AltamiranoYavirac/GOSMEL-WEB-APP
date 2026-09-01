import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICertificadoFormValues } from "../model/CertificadoForm.config";

export async function emitirCertificado(
  values: ICertificadoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("certificados")
    .insert({
      inscripcion_id: values.inscripcionId,
      codigo_verificacion: values.codigoVerificacion.trim().toUpperCase(),
      fecha_emision: values.fechaEmision,
      storage_path: values.storagePath?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function eliminarCertificado(
  certificadoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("certificados").delete().eq("id", certificadoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export interface IInscripcionCertificadoOption {
  id: string;
  label: string;
}

export async function getInscripcionesParaCertificados(): Promise<{
  data: IInscripcionCertificadoOption[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const [inscripciones, certificadosExistentes] = await Promise.all([
    supabase
      .from("inscripciones")
      .select("id, estudiantes(nombres, apellidos), catedras(codigo, cursos(nombre))")
      .in("estado", ["activa", "finalizada"])
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("certificados").select("inscripcion_id"),
  ]);

  if (inscripciones.error) {
    return { data: null, error: inscripciones.error.message };
  }

  const emitidosSet = new Set((certificadosExistentes.data ?? []).map((c) => c.inscripcion_id));

  const options: IInscripcionCertificadoOption[] = (inscripciones.data ?? [])
    .filter((item) => !emitidosSet.has(item.id))
    .map((item) => {
      const est = item.estudiantes;
      const cat = item.catedras;
      return {
        id: item.id,
        label: `${est?.nombres ?? ""} ${est?.apellidos ?? ""} — ${cat?.cursos?.nombre ?? ""} (${cat?.codigo ?? ""})`.trim(),
      };
    });

  return { data: options, error: null };
}
