"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarAcuerdo } from "../api/eliminarAcuerdo";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useEliminarAcuerdo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (acuerdoId: string) => {
      const { error } = await eliminarAcuerdo(acuerdoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: acuerdosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Acuerdo de pago eliminado");
    },
    onError: (error) => toast.error(error.message),
  });
}
