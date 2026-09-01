"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateModulo } from "../api/updateModulo";
import type { IModuloFormValues } from "../model/ModuloForm.config";
import { cursosQueryKeys } from "../model/query-keys";

export function useUpdateModulo(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduloId, values }: { moduloId: string; values: IModuloFormValues }) => {
      const { data, error } = await updateModulo(moduloId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
    },
  });
}
