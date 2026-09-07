import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ITeacherInstrumentoUpdateItem {
  instrumentoId: string;
  esPrincipal: boolean;
}

export async function updateTeacherInstrumentos(
  items: ITeacherInstrumentoUpdateItem[]
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const { error: deleteError } = await supabase
    .from("docente_instrumento")
    .delete()
    .eq("docente_id", user.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  if (items.length > 0) {
    const records = items.map((i) => ({
      docente_id: user.id,
      instrumento_id: i.instrumentoId,
      es_principal: i.esPrincipal,
    }));

    const { error: insertError } = await supabase
      .from("docente_instrumento")
      .insert(records);

    if (insertError) {
      return { error: insertError.message };
    }
  }

  return { error: null };
}
