"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherEvaluaciones } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherEvaluaciones() {
  return useQuery({
    queryKey: teacherQueryKeys.evaluaciones(),
    queryFn: async () => {
      const { data, error } = await getTeacherEvaluaciones();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 30_000,
  });
}
