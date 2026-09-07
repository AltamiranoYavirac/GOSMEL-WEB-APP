import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherPerfilPayload,
  type ITeacherPerfilFormValues,
} from "../model/TeacherPerfilForm.config";

export async function updateTeacherPerfil(
  values: ITeacherPerfilFormValues
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const payload = buildTeacherPerfilPayload(values);

  const { data: existing } = await supabase
    .from("docentes")
    .select("perfil_id")
    .eq("perfil_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("docentes")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("perfil_id", user.id);

    if (error) return { error: error.message };
  } else {
    const slug = `docente-${user.id.slice(0, 8)}`;
    const { error } = await supabase.from("docentes").insert({
      perfil_id: user.id,
      slug,
      ...payload,
    });

    if (error) return { error: error.message };
  }

  return { error: null };
}
