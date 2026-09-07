"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherSesiones } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherSesiones() {
  return useQuery({
    queryKey: teacherQueryKeys.sesiones(),
    queryFn: async () => {
      const { data, error } = await getTeacherSesiones();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 30_000,
  });
}
