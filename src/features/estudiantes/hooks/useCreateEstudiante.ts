"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createEstudiante, type ICreateEstudianteInput } from "../api/createEstudiante";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useCreateEstudiante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ICreateEstudianteInput) => {
      const { data, error } = await createEstudiante(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.list() });
      toast.success("Estudiante registrado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al registrar estudiante: ${error.message}`);
    },
  });
}
