"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarCatedra } from "../api/eliminarCatedra";
import { catedrasQueryKeys } from "../model/query-keys";

export function useEliminarCatedra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (catedraId: string) => {
      const { error } = await eliminarCatedra(catedraId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.list() });
      toast.success("Cátedra eliminada exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
