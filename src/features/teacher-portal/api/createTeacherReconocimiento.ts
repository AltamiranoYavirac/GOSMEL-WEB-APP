import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherReconocimientoPayload,
  type ITeacherReconocimientoFormValues,
} from "../model/TeacherReconocimientoForm.config";

export async function createTeacherReconocimiento(
  values: ITeacherReconocimientoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const payload = buildTeacherReconocimientoPayload(values, user.id);

  const { data, error } = await supabase
    .from("docente_reconocimientos")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
