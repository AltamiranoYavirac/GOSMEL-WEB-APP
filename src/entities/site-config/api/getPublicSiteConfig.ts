import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { ISiteConfig } from "../model/site-config.types";
import { getSiteConfig } from "./getSiteConfig";

export const getPublicSiteConfig = cache(
  async (): Promise<{ data: ISiteConfig | null; error: string | null }> =>
    getSiteConfig(createSupabasePublicClient()),
);
