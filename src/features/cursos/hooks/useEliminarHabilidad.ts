"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarHabilidad } from "../api/getCursoHabilidades";
import { cursosQueryKeys } from "../model/query-keys";

export function useEliminarHabilidad(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habilidadId: string) => {
      const { error } = await eliminarHabilidad(habilidadId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "habilidades", cursoId] });
    },
  });
}
