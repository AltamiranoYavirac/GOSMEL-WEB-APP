"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarCuota } from "../api/eliminarCuota";
import { cuotasQueryKeys } from "../model/query-keys";

export function useEliminarCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cuotaId: string) => {
      const { error } = await eliminarCuota(cuotaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Cuota eliminada");
    },
    onError: (error) => toast.error(error.message),
  });
}
