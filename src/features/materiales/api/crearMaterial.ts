import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { ICrearMaterialFormValues } from "../model/CrearMaterialForm.config";

export async function crearMaterial(
  values: ICrearMaterialFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const material: TablesInsert<"materiales"> = {
    titulo: values.titulo,
    tipo: values.tipo,
    visible_para: values.visibilidad,
    subido_por: user?.id ?? null,
  };

  if (values.destino === "curso" && values.cursoId) material.curso_id = values.cursoId;
  if (values.destino === "catedra" && values.catedraId) material.catedra_id = values.catedraId;
  if (values.urlExterna) material.url_externa = values.urlExterna;

  const { data, error } = await supabase.from("materiales").insert(material).select("id").single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}