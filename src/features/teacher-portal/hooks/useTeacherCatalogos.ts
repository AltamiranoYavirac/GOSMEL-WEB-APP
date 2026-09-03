"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherCatalogos } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherCatalogos(enabled = true) {
  return useQuery({
    queryKey: teacherQueryKeys.catalogos(),
    queryFn: async () => {
      const { data, error } = await getTeacherCatalogos();
      if (error) throw new Error(error);
      return data ?? { catedras: [], instrumentos: [] };
    },
    enabled,
    staleTime: 60_000,
  });
}
