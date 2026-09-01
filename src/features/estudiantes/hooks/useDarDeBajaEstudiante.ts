"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { darDeBajaEstudiante, type IDarDeBajaEstudianteInput } from "../api/darDeBajaEstudiante";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useDarDeBajaEstudiante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IDarDeBajaEstudianteInput) => {
      const { error } = await darDeBajaEstudiante(input);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.all });
      toast.success("Baja del estudiante tramitada correctamente");
    },
    onError: (error) => {
      toast.error(`Error al tramitar baja: ${error.message}`);
    },
  });
}
