"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentCatedras } from "../api/getStudentCatedras";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentCatedras(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.catedras(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentCatedras(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudieron cargar las cátedras");
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}