"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { rechazarSolicitudMatricula } from "../api/rechazarSolicitudMatricula";

export function useRechazarSolicitudMatricula(catedraId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inscripcionId: string) => {
      const { error } = await rechazarSolicitudMatricula(inscripcionId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      if (catedraId) {
        queryClient.invalidateQueries({ queryKey: ["catedras", catedraId, "estudiantes"] });
      }
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      toast.success("Solicitud de matrícula descartada");
    },
    onError: (error) => toast.error(error.message),
  });
}
