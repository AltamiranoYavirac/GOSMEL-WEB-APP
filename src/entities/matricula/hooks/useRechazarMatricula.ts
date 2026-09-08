"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { rechazarMatricula } from "../api/rechazarMatricula";
import { matriculasQueryKeys } from "../model/query-keys";

export interface IRechazarMatriculaArgs {
  inscripcionId: string;
  motivo: string;
}

export function useRechazarMatricula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inscripcionId, motivo }: IRechazarMatriculaArgs) => {
      const { error } = await rechazarMatricula(inscripcionId, motivo);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matriculasQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      toast.success("Matrícula rechazada");
    },
    onError: (error) => toast.error(error.message),
  });
}
