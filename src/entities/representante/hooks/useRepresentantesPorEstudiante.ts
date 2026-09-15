"use client";

import { useQuery } from "@tanstack/react-query";
import { getRepresentantesPorEstudiante } from "../api/getRepresentantesPorEstudiante";
import { representantesQueryKeys } from "../model/query-keys";

export function useRepresentantesPorEstudiante(estudianteId: string | null) {
  return useQuery({
    queryKey: representantesQueryKeys.byEstudiante(estudianteId ?? ""),
    enabled: Boolean(estudianteId),
    queryFn: async () => {
      const { data, error } = await getRepresentantesPorEstudiante(estudianteId!);
      if (error) throw new Error(error);
      return data ?? [];
    },
    retry: false,
  });
}
