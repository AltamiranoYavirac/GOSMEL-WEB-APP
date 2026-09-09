"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursoTemario } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useCursoTemario(cursoId: string | null, enabled = true) {
  return useQuery({
    queryKey: teacherQueryKeys.cursoTemario(cursoId ?? ""),
    queryFn: async () => {
      if (!cursoId) return null;
      const { data, error } = await getCursoTemario(cursoId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(cursoId) && enabled,
  });
}
