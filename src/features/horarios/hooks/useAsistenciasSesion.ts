"use client";

import { useQuery } from "@tanstack/react-query";

import { getAsistenciasSesion } from "../api/getAsistenciasSesion";
import { horariosQueryKeys } from "../model/query-keys";

export function useAsistenciasSesion(sesionId: string, enabled = true) {
  return useQuery({
    queryKey: [...horariosQueryKeys.all, "asistencias", sesionId],
    queryFn: async () => {
      const { data, error } = await getAsistenciasSesion(sesionId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: enabled && !!sesionId,
  });
}
