"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentPracticeLogs } from "../api/getStudentPracticeLogs";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentPracticeLogs(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.practica(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentPracticeLogs(estudianteId as string);
      if (error || !data) throw new Error(error ?? "No se pudieron cargar los registros de práctica");
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}