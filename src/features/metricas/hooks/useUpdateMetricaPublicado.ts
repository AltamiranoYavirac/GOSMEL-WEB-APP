"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateMetricaPublicado } from "../api/updateMetricaPublicado";
import { metricasQueryKeys } from "../model/query-keys";

export function useUpdateMetricaPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await updateMetricaPublicado(id, publicado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metricasQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}