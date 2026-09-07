"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentMaterials } from "../api/getStudentMaterials";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentMaterials(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.materiales(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentMaterials(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudieron cargar los materiales");
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}