"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherSesionAsistencia } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherSesionAsistencia(sesionId: string | null, enabled = true) {
  return useQuery({
    queryKey: teacherQueryKeys.sesionAsistencia(sesionId ?? ""),
    queryFn: async () => {
      if (!sesionId) return null;
      const { data, error } = await getTeacherSesionAsistencia(sesionId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(sesionId) && enabled,
    staleTime: 10_000,
  });
}
