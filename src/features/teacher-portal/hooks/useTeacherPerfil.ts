"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherPerfil } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherPerfil() {
  return useQuery({
    queryKey: teacherQueryKeys.perfil(),
    queryFn: async () => {
      const { data, error } = await getTeacherPerfil();
      if (error) throw new Error(error);
      return data;
    },
  });
}
