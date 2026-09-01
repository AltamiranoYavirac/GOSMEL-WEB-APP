"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarLeccion } from "../api/eliminarLeccion";
import { cursosQueryKeys } from "../model/query-keys";

export function useEliminarLeccion(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leccionId: string) => {
      const { error } = await eliminarLeccion(leccionId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
    },
  });
}
