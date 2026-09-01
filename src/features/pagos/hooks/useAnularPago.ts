"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { anularPago } from "../api/anularPago";

export function useAnularPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pagoId: string) => {
      const { error } = await anularPago(pagoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Pago anulado y saldo de cuota restaurado");
    },
    onError: (error) => toast.error(error.message),
  });
}
