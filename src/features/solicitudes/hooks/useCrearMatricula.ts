"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearMatricula } from "../api/crearMatricula";
import { solicitudesQueryKeys } from "../model/query-keys";
import type { ICrearMatriculaFormValues } from "../model/CrearMatriculaForm.config";

export function useCrearMatricula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ solicitudId, values }: { solicitudId: string; values: ICrearMatriculaFormValues }) => {
      const { data, error } = await crearMatricula(solicitudId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solicitudesQueryKeys.list() });
      toast.success("Matrícula creada");
    },
    onError: (error) => toast.error(error.message),
  });
}