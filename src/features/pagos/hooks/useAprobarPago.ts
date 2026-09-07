"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { aprobarPago } from "../api/aprobarPago";

export function useAprobarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pagoId: string) => {
      const { data, error } = await aprobarPago(pagoId);
      if (error || !data) throw new Error(error ?? "No se pudo aprobar el pago");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      toast.success("Pago aprobado con éxito y cuota recalculada");
    },
    onError: (error) => toast.error(error.message),
  });
}
