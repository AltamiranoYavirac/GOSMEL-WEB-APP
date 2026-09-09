"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentReviews } from "../api/getStudentReviews";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentReviews(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.resenas(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentReviews(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudieron cargar las reseñas");
      return data ?? [];
    },
    retry: false,
    enabled: Boolean(estudianteId),
  });
}