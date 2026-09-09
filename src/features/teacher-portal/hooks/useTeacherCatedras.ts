"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherCatedras } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherCatedras() {
  return useQuery({
    queryKey: teacherQueryKeys.catedras(),
    queryFn: async () => {
      const { data, error } = await getTeacherCatedras();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}
