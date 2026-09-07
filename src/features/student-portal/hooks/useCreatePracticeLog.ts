"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPracticeLog } from "../api/createPracticeLog";
import { studentQueryKeys } from "../model/query-keys";
import type { IRegistrarPracticaFormValues } from "../model/RegistrarPracticaForm.config";

export function useCreatePracticeLog(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IRegistrarPracticaFormValues) => {
      const { data, error } = await createPracticeLog(estudianteId, values);
      if (error || !data) throw new Error(error ?? "No se pudo registrar la práctica");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.practica(estudianteId) });
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.overview(estudianteId) });
      toast.success("Práctica registrada");
    },
    onError: (error) => toast.error(error.message),
  });
}