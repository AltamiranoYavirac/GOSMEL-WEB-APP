"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reactivarCuota } from "../api/reactivarCuota";
import { cuotasQueryKeys } from "../model/query-keys";

export function useReactivarCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cuotaId: string) => {
      const { error } = await reactivarCuota(cuotaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Cuota reactivada para cobro exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
