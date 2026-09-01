"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { registrarPagoFamiliar, type IRegistrarPagoFamiliarInput } from "../api/registrarPagoFamiliar";
import { cobranzaQueryKeys } from "../model/query-keys";

export function useRegistrarPagoFamiliar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IRegistrarPagoFamiliarInput) => {
      const { error } = await registrarPagoFamiliar(input);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cobranzaQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      queryClient.invalidateQueries({ queryKey: ["representantes"] });
      toast.success("Pago familiar registrado y cuotas actualizadas");
    },
    onError: (error) => {
      toast.error(`Error al registrar pago: ${error.message}`);
    },
  });
}
