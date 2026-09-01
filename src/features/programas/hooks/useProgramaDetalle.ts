"use client";

import { useQuery } from "@tanstack/react-query";

import { getProgramaDetalle } from "../api/getProgramaDetalle";
import { programasQueryKeys } from "../model/query-keys";

export function useProgramaDetalle(programaId: string, enabled = true) {
  return useQuery({
    queryKey: [...programasQueryKeys.all, "detalle", programaId],
    queryFn: async () => {
      const { data, error } = await getProgramaDetalle(programaId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: enabled && !!programaId,
  });
}
