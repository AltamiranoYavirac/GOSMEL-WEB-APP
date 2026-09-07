"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentGrades } from "../api/getStudentGrades";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentGrades(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.notas(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentGrades(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudieron cargar las notas");
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}