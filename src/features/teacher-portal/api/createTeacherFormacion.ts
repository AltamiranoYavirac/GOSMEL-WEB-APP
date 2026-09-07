import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherFormacionPayload,
  type ITeacherFormacionFormValues,
} from "../model/TeacherFormacionForm.config";

export async function createTeacherFormacion(
  values: ITeacherFormacionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const payload = buildTeacherFormacionPayload(values, user.id);

  const { data, error } = await supabase
    .from("docente_formacion")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
