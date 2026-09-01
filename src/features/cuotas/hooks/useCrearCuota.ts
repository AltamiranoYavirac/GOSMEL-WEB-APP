"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearCuota, type ICrearCuotaInput } from "../api/crearCuota";
import { cuotasQueryKeys } from "../model/query-keys";

export function useCrearCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICrearCuotaInput) => {
      const { data, error } = await crearCuota(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Cuota creada exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
