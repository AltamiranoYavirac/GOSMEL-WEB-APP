"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarTestimonio } from "../api/eliminarTestimonio";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useEliminarTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await eliminarTestimonio(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() }),
  });
}
