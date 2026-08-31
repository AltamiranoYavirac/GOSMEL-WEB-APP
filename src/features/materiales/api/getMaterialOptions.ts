import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICatedraMaterialOption, ICursoMaterialOption } from "../model/CrearMaterialForm.config";

export async function getMaterialOptions(): Promise<{
  data: { cursos: ICursoMaterialOption[]; catedras: ICatedraMaterialOption[] } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const [cursos, catedras] = await Promise.all([
    supabase.from("cursos").select("id, nombre").order("nombre", { ascending: true }).limit(300),
    supabase.from("catedras").select("id, codigo, cursos(nombre)").order("codigo", { ascending: true }).limit(300),
  ]);

  const firstError = [cursos, catedras].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  return {
    data: {
      cursos: (cursos.data ?? []).map((curso) => ({ id: curso.id, nombre: curso.nombre })),
      catedras: (catedras.data ?? []).map((catedra) => ({
        id: catedra.id,
        label: `${catedra.codigo} · ${catedra.cursos?.nombre ?? "Sin curso"}`,
      })),
    },
    error: null,
  };
}