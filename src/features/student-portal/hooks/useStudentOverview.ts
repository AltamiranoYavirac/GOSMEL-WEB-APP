"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentOverview } from "../api/getStudentOverview";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentOverview(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.overview(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentOverview(estudianteId as string);
      if (error || !data) throw new Error(error ?? "No se pudo cargar el resumen");
      return data;
    },
    retry: false,
    enabled: Boolean(estudianteId),
  });
}