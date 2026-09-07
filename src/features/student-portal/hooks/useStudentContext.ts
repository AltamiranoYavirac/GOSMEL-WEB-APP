"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentContext } from "../api/getStudentContext";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentContext() {
  return useQuery({
    queryKey: studentQueryKeys.context(),
    queryFn: async () => {
      const { data, error } = await getStudentContext();
      if (error || !data) throw new Error(error ?? "No se pudo cargar el contexto");
      return data;
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}