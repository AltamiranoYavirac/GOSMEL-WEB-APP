"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentFavorites } from "../api/getStudentFavorites";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentFavorites() {
  return useQuery({
    queryKey: studentQueryKeys.favoritos(),
    queryFn: async () => {
      const { data, error } = await getStudentFavorites();
      if (error) throw new Error(error ?? "No se pudieron cargar los favoritos");
      return data ?? [];
    },
    retry: false,
  });
}