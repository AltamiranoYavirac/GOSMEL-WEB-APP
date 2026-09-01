"use client";

import { useQuery } from "@tanstack/react-query";

import { getSolicitudes } from "../api/getSolicitudes";
import { solicitudesQueryKeys } from "../model/query-keys";

export function useSolicitudes() {
  return useQuery({
    queryKey: solicitudesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getSolicitudes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}