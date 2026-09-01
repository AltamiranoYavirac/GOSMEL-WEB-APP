"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearCurso } from "../api/crearCurso";
import { cursosQueryKeys } from "../model/query-keys";
import type { ICrearCursoFormValues } from "../model/CrearCursoForm.config";

export function useCrearCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICrearCursoFormValues) => {
      const { data, error } = await crearCurso(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "options"] });
      toast.success("Curso creado");
    },
    onError: (error) => toast.error(error.message),
  });
}