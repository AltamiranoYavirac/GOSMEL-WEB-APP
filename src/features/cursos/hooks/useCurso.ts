"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursoById } from "../api/getCursoById";
import { cursosQueryKeys } from "../model/query-keys";

export function useCurso(id: string | null) {
  return useQuery({
    queryKey: cursosQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      const { data, error } = await getCursoById(id as string);
      if (error || !data) throw new Error(error ?? "No se pudo cargar el curso.");
      return data;
    },
    enabled: !!id,
    retry: false,
  });
}
