"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherCalificaciones } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherCalificaciones(evaluacionId: string | null, enabled = true) {
  return useQuery({
    queryKey: teacherQueryKeys.calificaciones(evaluacionId ?? ""),
    queryFn: async () => {
      if (!evaluacionId) return null;
      const { data, error } = await getTeacherCalificaciones(evaluacionId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(evaluacionId) && enabled,
    staleTime: 10_000,
  });
}
