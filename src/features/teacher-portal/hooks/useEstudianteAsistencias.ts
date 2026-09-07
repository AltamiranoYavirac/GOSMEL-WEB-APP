"use client";

import { useQuery } from "@tanstack/react-query";

import { getEstudianteAsistencias } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useEstudianteAsistencias(inscripcionId: string | null, enabled = true) {
  return useQuery({
    queryKey: teacherQueryKeys.estudianteAsistencias(inscripcionId ?? ""),
    queryFn: async () => {
      if (!inscripcionId) return [];
      const { data, error } = await getEstudianteAsistencias(inscripcionId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    enabled: Boolean(inscripcionId) && enabled,
    staleTime: 30_000,
  });
}
