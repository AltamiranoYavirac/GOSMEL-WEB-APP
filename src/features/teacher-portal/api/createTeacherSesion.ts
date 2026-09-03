import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherSesionPayload,
  type ITeacherSesionFormValues,
} from "../model/TeacherSesionForm.config";

export async function createTeacherSesion(
  values: ITeacherSesionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const payload = buildTeacherSesionPayload(values);

  const { data, error } = await supabase
    .from("sesiones")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
