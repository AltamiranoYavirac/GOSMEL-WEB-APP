"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarInstrumento } from "../api/eliminarInstrumento";
import { instrumentosQueryKeys } from "../model/query-keys";

export function useEliminarInstrumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instrumentoId: string) => {
      const { error } = await eliminarInstrumento(instrumentoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instrumentosQueryKeys.list() });
      toast.success("Instrumento eliminado");
    },
    onError: (error) => toast.error(error.message),
  });
}
