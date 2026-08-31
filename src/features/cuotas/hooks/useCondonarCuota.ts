"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { condonarCuota } from "../api/condonarCuota";
import { cuotasQueryKeys } from "../model/query-keys";

export function useCondonarCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cuotaId: string) => {
      const { error } = await condonarCuota(cuotaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
    },
  });
}
