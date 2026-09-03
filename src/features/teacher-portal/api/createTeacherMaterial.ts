import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildTeacherMaterialPayload,
  type ITeacherMaterialFormValues,
} from "../model/TeacherMaterialForm.config";

export async function createTeacherMaterial(
  values: ITeacherMaterialFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const payload = buildTeacherMaterialPayload(values, user.id);

  const { data, error } = await supabase
    .from("materiales")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
