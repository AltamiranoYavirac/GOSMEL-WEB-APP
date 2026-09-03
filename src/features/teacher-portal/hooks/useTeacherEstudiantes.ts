"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherEstudiantes } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherEstudiantes() {
  return useQuery({
    queryKey: teacherQueryKeys.estudiantes(),
    queryFn: async () => {
      const { data, error } = await getTeacherEstudiantes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
  });
}
