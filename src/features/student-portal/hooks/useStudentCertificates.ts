"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentCertificates } from "../api/getStudentCertificates";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentCertificates(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.certificados(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentCertificates(estudianteId as string);
      if (error) throw new Error(error ?? "No se pudieron cargar los certificados");
      return data ?? [];
    },
    retry: false,
    enabled: Boolean(estudianteId),
  });
}