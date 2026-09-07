"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { rechazarPago } from "../api/rechazarPago";

export function useRechazarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pagoId, observacion }: { pagoId: string; observacion: string }) => {
      const { data, error } = await rechazarPago(pagoId, observacion);
      if (error || !data) throw new Error(error ?? "No se pudo rechazar el pago");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      toast.success("Pago marcado como rechazado");
    },
    onError: (error) => toast.error(error.message),
  });
}
