"use client";

import { useQuery } from "@tanstack/react-query";

import { getHorariosRecurrentes } from "../api/getHorariosRecurrentes";
import { horariosQueryKeys } from "../model/query-keys";

export function useHorariosRecurrentes() {
  return useQuery({
    queryKey: horariosQueryKeys.recurrentes(),
    queryFn: async () => {
      const { data, error } = await getHorariosRecurrentes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}