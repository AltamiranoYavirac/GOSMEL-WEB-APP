"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentCurriculum } from "../api/getStudentCurriculum";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentCurriculum(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.curriculum(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentCurriculum(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudo cargar el temario");
      return data ?? [];
    },
    retry: false,
    enabled: Boolean(estudianteId),
  });
}