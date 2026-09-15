"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { actualizarMetrica } from "../api/actualizarMetrica";
import type { IMetricaFormValues } from "../model/MetricaForm.config";
import { metricasQueryKeys } from "../model/query-keys";

export function useActualizarMetrica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: IMetricaFormValues }) => {
      const { data, error } = await actualizarMetrica(id, values);
      if (error || !data) throw new Error(error ?? "No se pudo actualizar la métrica.");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metricasQueryKeys.list() }),
  });
}
