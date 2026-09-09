"use client";

import { useQuery } from "@tanstack/react-query";

import { getSiteConfig } from "../api/getSiteConfig";
import { siteConfigQueryKeys } from "../model/query-keys";

export function useSiteConfig() {
  return useQuery({
    queryKey: siteConfigQueryKeys.detail(),
    queryFn: async () => {
      const { data, error } = await getSiteConfig();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}
