"use client";

import { useQuery } from "@tanstack/react-query";

import { getCuotasPendientesFamilia } from "../api/getCuotasPendientesFamilia";
import { cobranzaQueryKeys } from "../model/query-keys";

export function useCuotasPendientesFamilia(
  responsableId: string,
  responsableTipo: "representante" | "estudiante" = "representante",
  enabled = true,
) {
  return useQuery({
    queryKey: [...cobranzaQueryKeys.all, "cuotas-pendientes-familia", responsableTipo, responsableId],
    queryFn: async () => {
      const { data, error } = await getCuotasPendientesFamilia(responsableId, responsableTipo);
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 30_000,
    retry: false,
    enabled: enabled && !!responsableId,
  });
}
