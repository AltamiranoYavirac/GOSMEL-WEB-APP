"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarModulo } from "../api/eliminarModulo";
import { cursosQueryKeys } from "../model/query-keys";

export function useEliminarModulo(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduloId: string) => {
      const { error } = await eliminarModulo(moduloId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
    },
  });
}
