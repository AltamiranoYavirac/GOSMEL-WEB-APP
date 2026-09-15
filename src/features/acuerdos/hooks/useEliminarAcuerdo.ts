"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarAcuerdo } from "../api/eliminarAcuerdo";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useEliminarAcuerdo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ acuerdoId, motivo, resoluciones }: { acuerdoId: string; motivo: string; resoluciones: import("../api/eliminarAcuerdo").ICierreResolucion[] }) => {
      const { error } = await eliminarAcuerdo(acuerdoId, motivo, resoluciones);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: acuerdosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      toast.success("Acuerdo finalizado; el historial se conserva");
    },
    onError: (error) => toast.error(error.message),
  });
}
