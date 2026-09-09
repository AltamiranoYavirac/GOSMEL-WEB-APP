"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentSessions } from "../api/getStudentSessions";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentSessions(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.sesiones(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentSessions(estudianteId as string);
      if (error || !data) throw new Error(error ?? "No se pudieron cargar las sesiones");
      return data;
    },
    retry: false,
    enabled: Boolean(estudianteId),
  });
}