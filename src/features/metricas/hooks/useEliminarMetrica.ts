"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarMetrica } from "../api/eliminarMetrica";
import { metricasQueryKeys } from "../model/query-keys";

export function useEliminarMetrica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await eliminarMetrica(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metricasQueryKeys.list() }),
  });
}
