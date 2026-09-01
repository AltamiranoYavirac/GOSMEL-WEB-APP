"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { guardarCalificaciones, type IGuardarCalificacionItem } from "../api/guardarCalificaciones";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useGuardarCalificaciones(evaluacionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (calificaciones: IGuardarCalificacionItem[]) => {
      const { error } = await guardarCalificaciones(evaluacionId, calificaciones);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...evaluacionesQueryKeys.all, "calificaciones", evaluacionId] });
      queryClient.invalidateQueries({ queryKey: evaluacionesQueryKeys.list() });
    },
  });
}
