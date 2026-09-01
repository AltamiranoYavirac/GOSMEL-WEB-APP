"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearLeccion } from "../api/crearLeccion";
import type { ILeccionFormValues } from "../model/LeccionForm.config";
import { cursosQueryKeys } from "../model/query-keys";

export function useCrearLeccion(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduloId, values }: { moduloId: string; values: ILeccionFormValues }) => {
      const { data, error } = await crearLeccion(moduloId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
    },
  });
}
