"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { condonarCuota } from "../api/condonarCuota";
import { cuotasQueryKeys } from "../model/query-keys";

import { toast } from "sonner";

export function useCondonarCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cuotaId: string) => {
      const { error } = await condonarCuota(cuotaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Cuota condonada exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
