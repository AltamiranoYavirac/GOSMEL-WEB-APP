"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarMaterial } from "../api/eliminarMaterial";
import { materialesQueryKeys } from "../model/query-keys";

export function useEliminarMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const { error } = await eliminarMaterial(materialId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialesQueryKeys.list() });
      toast.success("Material eliminado exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
