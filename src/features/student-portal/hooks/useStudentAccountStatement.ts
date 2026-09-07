"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentAccountStatement } from "../api/getStudentAccountStatement";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentAccountStatement(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.finanzas(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentAccountStatement(estudianteId as string);
      if (error || !data) throw new Error(error ?? "No se pudo cargar el estado de cuenta");
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}