"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateEstudiante } from "../api/updateEstudiante";
import { estudiantesQueryKeys } from "../model/query-keys";
import type { IEditarEstudianteFormValues } from "../model/EditarEstudianteForm.config";

export function useUpdateEstudiante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: IEditarEstudianteFormValues }) => {
      const { data, error } = await updateEstudiante(id, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.list() });
      toast.success("Estudiante actualizado");
    },
    onError: (error) => toast.error(error.message),
  });
}