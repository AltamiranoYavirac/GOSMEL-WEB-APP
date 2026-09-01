"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLeccion } from "../api/updateLeccion";
import type { ILeccionFormValues } from "../model/LeccionForm.config";
import { cursosQueryKeys } from "../model/query-keys";

export function useUpdateLeccion(cursoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leccionId, values }: { leccionId: string; values: ILeccionFormValues }) => {
      const { data, error } = await updateLeccion(leccionId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "guia", cursoId] });
    },
  });
}
