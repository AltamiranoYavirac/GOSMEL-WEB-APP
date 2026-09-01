"use client";

import { useQuery } from "@tanstack/react-query";

import { getCuotasPendientesFamilia } from "../api/getCuotasPendientesFamilia";
import { cobranzaQueryKeys } from "../model/query-keys";

export function useCuotasPendientesFamilia(representanteId: string, enabled = true) {
  return useQuery({
    queryKey: [...cobranzaQueryKeys.all, "cuotas-pendientes-familia", representanteId],
    queryFn: async () => {
      const { data, error } = await getCuotasPendientesFamilia(representanteId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 30_000,
    retry: false,
    enabled: enabled && !!representanteId,
  });
}