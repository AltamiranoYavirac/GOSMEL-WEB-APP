"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearTestimonio } from "../api/crearTestimonio";
import type { ITestimonioFormValues } from "../model/TestimonioForm.config";
import { testimoniosQueryKeys } from "../model/query-keys";

export function useCrearTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ITestimonioFormValues) => {
      const { data, error } = await crearTestimonio(values);
      if (error || !data) throw new Error(error ?? "No se pudo crear el testimonio.");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() }),
  });
}
