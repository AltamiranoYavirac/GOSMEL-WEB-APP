"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearHabilidad } from "../api/getCursoHabilidades";
import { cursosQueryKeys } from "../model/query-keys";

export function useCrearHabilidad(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habilidad, orden }: { habilidad: string; orden?: number }) => {
      const { data, error } = await crearHabilidad(cursoId, habilidad, orden);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "habilidades", cursoId] });
    },
  });
}
