"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarPrograma } from "../api/eliminarPrograma";
import { programasQueryKeys } from "../model/query-keys";

export function useEliminarPrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programaId: string) => {
      const { error } = await eliminarPrograma(programaId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
