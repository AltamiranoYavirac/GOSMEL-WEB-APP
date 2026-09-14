import { cache } from "react"

import { createSupabasePublicClient } from "@/shared/api/supabase/public"

import { getPublicDocentes } from "./api/getPublicDocentes"

export const getPublicDocentesServer = cache(async () => {
  return getPublicDocentes(createSupabasePublicClient())
})
