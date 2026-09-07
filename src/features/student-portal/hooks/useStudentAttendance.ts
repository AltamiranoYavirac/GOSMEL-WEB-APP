"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudentAttendance } from "../api/getStudentAttendance";
import { studentQueryKeys } from "../model/query-keys";

export function useStudentAttendance(estudianteId: string | null) {
  return useQuery({
    queryKey: studentQueryKeys.asistencias(estudianteId ?? ""),
    queryFn: async () => {
      const { data, error } = await getStudentAttendance(estudianteId as string);
      if (error || !data) throw new Error(error ?? "No se pudo cargar la asistencia");
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(estudianteId),
  });
}