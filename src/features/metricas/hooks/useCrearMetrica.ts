"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearMetrica } from "../api/crearMetrica";
import type { IMetricaFormValues } from "../model/MetricaForm.config";
import { metricasQueryKeys } from "../model/query-keys";

export function useCrearMetrica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IMetricaFormValues) => {
      const { data, error } = await crearMetrica(values);
      if (error || !data) throw new Error(error ?? "No se pudo crear la métrica.");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metricasQueryKeys.list() }),
  });
}
