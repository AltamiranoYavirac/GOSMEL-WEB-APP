"use client";

import { useQuery } from "@tanstack/react-query";

import { getSiteAssetsAdmin } from "../api/getSiteAssetsAdmin";
import { siteAssetsAdminQueryKeys } from "../model/query-keys";

export function useSiteAssetsAdmin() {
  return useQuery({
    queryKey: siteAssetsAdminQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getSiteAssetsAdmin();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}
