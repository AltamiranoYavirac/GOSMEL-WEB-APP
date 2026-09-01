"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearSesion } from "../api/crearSesion";
import type { ISesionFormValues } from "../model/SesionForm.config";
import { horariosQueryKeys } from "../model/query-keys";

export function useCrearSesion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ISesionFormValues) => {
      const { data, error } = await crearSesion(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.sesiones() });
    },
  });
}
