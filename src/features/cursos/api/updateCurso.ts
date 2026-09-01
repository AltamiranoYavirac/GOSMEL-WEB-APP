import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IUpdateCursoPatch {
  nombre?: string;
  slug?: string;
  resumen?: string | null;
  descripcion?: string;
  instrumento_id?: string | null;
  nivel?: "iniciacion" | "basico" | "intermedio" | "avanzado" | "maestria";
  modalidad?: "presencial" | "virtual" | "hibrido";
  duracion_semanas?: number | null;
  horas_totales?: number | null;
  precio_referencial?: number | null;
  etiqueta_precio?: string | null;
  mostrar_precio?: boolean;
  video_intro_url?: string | null;
  portada_public_id?: string | null;
  publicado?: boolean;
  destacado?: boolean;
}

export async function updateCurso(
  id: string,
  patch: IUpdateCursoPatch
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cursos")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}