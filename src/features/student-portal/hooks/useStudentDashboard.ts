"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentDashboard } from "../api/getStudentDashboard";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentDashboard() {
  return useQuery({
    queryKey: studentQueryKeys.dashboard(),
    queryFn: async () => {
      const { data, error } = await getStudentDashboard();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    retry: false,
  });
}