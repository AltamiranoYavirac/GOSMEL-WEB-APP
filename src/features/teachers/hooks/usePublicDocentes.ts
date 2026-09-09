"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicDocentes } from "../api";
import { teachersPublicQueryKeys } from "../model/query-keys";

export function usePublicDocentes() {
  return useQuery({
    queryKey: teachersPublicQueryKeys.lists(),
    queryFn: async () => {
      const { data, error } = await getPublicDocentes();
      if (error || !data) {
        throw new Error(error ?? "No se pudieron cargar los profesores.");
      }
      return data;
    },
  });
}
