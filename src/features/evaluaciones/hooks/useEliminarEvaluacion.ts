"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarEvaluacion } from "../api/eliminarEvaluacion";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useEliminarEvaluacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluacionId: string) => {
      const { error } = await eliminarEvaluacion(evaluacionId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluacionesQueryKeys.list() });
    },
  });
}
