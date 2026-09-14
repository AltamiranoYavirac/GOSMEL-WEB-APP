import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicProgram } from "../model/program-public.types";
import { mapPublicProgram, PUBLIC_PROGRAM_SELECT } from "./getPublicPrograms";

export async function getPublicProgramBySlug(slug: string): Promise<{
  data: IPublicProgram | null;
  error: string | null;
}> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("programas")
    .select(PUBLIC_PROGRAM_SELECT)
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  return { data: mapPublicProgram(data), error: null };
}
