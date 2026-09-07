"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherMateriales } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherMateriales() {
  return useQuery({
    queryKey: teacherQueryKeys.materiales(),
    queryFn: async () => {
      const { data, error } = await getTeacherMateriales();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 30_000,
  });
}
