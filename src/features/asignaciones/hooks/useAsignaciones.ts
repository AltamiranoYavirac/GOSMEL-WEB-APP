"use client";

import { useQuery } from "@tanstack/react-query";

import { getAsignaciones } from "../api/getAsignaciones";
import { asignacionesQueryKeys } from "../model/query-keys";

export function useAsignaciones() {
  return useQuery({
    queryKey: asignacionesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getAsignaciones();
      if (error) throw new Error(error);
      return data ?? { catedras: [], docentes: [] };
    },
    retry: false,
  });
}
