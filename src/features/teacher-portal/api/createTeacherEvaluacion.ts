import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherEvaluacionPayload,
  type ITeacherEvaluacionFormValues,
} from "../model/TeacherEvaluacionForm.config";

export async function createTeacherEvaluacion(
  values: ITeacherEvaluacionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const payload = buildTeacherEvaluacionPayload(values, user.id);

  const { data, error } = await supabase
    .from("evaluaciones")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
