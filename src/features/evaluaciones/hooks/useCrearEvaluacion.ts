"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearEvaluacion } from "../api/crearEvaluacion";
import type { IEvaluacionFormValues } from "../model/EvaluacionForm.config";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useCrearEvaluacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IEvaluacionFormValues) => {
      const { data, error } = await crearEvaluacion(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluacionesQueryKeys.list() });
    },
  });
}
