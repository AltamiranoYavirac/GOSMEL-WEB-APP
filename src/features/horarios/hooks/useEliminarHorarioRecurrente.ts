"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eliminarHorarioRecurrente } from "../api/eliminarHorarioRecurrente";
import { horariosQueryKeys } from "../model/query-keys";

export function useEliminarHorarioRecurrente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horarioId: string) => {
      const { error } = await eliminarHorarioRecurrente(horarioId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.recurrentes() });
    },
  });
}
