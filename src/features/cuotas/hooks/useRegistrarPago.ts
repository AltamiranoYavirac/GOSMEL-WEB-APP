"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { registrarPago } from "../api/registrarPago";
import { cuotasQueryKeys } from "../model/query-keys";
import type { IRegistrarPagoFormValues } from "../model/RegistrarPagoForm.config";

export function useRegistrarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cuotaId, values }: { cuotaId: string; values: IRegistrarPagoFormValues }) => {
      const { data, error } = await registrarPago(cuotaId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Pago registrado");
    },
    onError: (error) => toast.error(error.message),
  });
}