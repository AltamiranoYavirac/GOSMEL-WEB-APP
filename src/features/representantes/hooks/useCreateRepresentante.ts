"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createRepresentante } from "../api/createRepresentante";
import { representantesQueryKeys } from "../model/query-keys";
import type { ICreateRepresentanteInput } from "../model/representante.types";

export function useCreateRepresentante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICreateRepresentanteInput) => {
      const { data, error } = await createRepresentante(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: representantesQueryKeys.list() });
      toast.success("Representante registrado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al registrar representante: ${error.message}`);
    },
  });
}
