"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearModulo } from "../api/crearModulo";
import type { IModuloFormValues } from "../model/ModuloForm.config";
import { cursosQueryKeys } from "../model/query-keys";

export function useCrearModulo(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IModuloFormValues) => {
      const { data, error } = await crearModulo(cursoId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
    },
  });
}
