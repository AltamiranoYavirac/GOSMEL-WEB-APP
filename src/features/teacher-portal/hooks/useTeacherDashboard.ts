"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherDashboard } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useTeacherDashboard() {
  return useQuery({
    queryKey: teacherQueryKeys.dashboard(),
    queryFn: async () => {
      const { data, error } = await getTeacherDashboard();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 30_000,
    retry: false,
  });
}