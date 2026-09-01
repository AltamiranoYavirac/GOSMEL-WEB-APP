"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createDocente, type ICreateDocenteInput } from "../api/createDocente";
import { docentesQueryKeys } from "../model/query-keys";

export function useCreateDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICreateDocenteInput) => {
      const { data, error } = await createDocente(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docentesQueryKeys.all });
      toast.success("Docente habilitado y registrado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al registrar docente: ${error.message}`);
    },
  });
}
