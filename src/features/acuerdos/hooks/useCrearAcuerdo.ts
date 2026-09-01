"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearAcuerdo, type ICrearAcuerdoInput } from "../api/crearAcuerdo";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useCrearAcuerdo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICrearAcuerdoInput) => {
      const { data, error } = await crearAcuerdo(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: acuerdosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      toast.success("Acuerdo de pago creado exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
