"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { solicitarMatricula, type ISolicitarMatriculaInput } from "../api/solicitarMatricula";
import { studentQueryKeys } from "../model/query-keys";

export function useSolicitarMatricula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ISolicitarMatriculaInput) => {
      const { data, error } = await solicitarMatricula(input);
      if (error || !data) throw new Error(error ?? "No se pudo solicitar la matrícula");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all });
      toast.success("Solicitud de matrícula enviada, quedó en revisión");
    },
    onError: (error) => toast.error(error.message),
  });
}