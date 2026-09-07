import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherPortafolioPayload,
  type ITeacherPortafolioFormValues,
} from "../model/TeacherPortafolioForm.config";

export async function createTeacherPortafolio(
  values: ITeacherPortafolioFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const payload = buildTeacherPortafolioPayload(values, user.id);

  const { data, error } = await supabase
    .from("docente_portafolio")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
