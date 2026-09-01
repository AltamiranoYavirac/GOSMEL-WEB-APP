"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearPrograma } from "../api/crearPrograma";
import type { IProgramaFormValues } from "../model/ProgramaForm.config";
import { programasQueryKeys } from "../model/query-keys";

export function useCrearPrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IProgramaFormValues) => {
      const { data, error } = await crearPrograma(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
