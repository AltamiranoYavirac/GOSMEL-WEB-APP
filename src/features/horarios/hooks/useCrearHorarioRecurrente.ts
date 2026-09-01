"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearHorarioRecurrente } from "../api/crearHorarioRecurrente";
import type { IHorarioFormValues } from "../model/HorarioForm.config";
import { horariosQueryKeys } from "../model/query-keys";

export function useCrearHorarioRecurrente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IHorarioFormValues) => {
      const { data, error } = await crearHorarioRecurrente(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.recurrentes() });
    },
  });
}
