"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarInscripcionCatedra } from "../api/eliminarInscripcionCatedra";

export function useEliminarInscripcionCatedra(catedraId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inscripcionId: string) => {
      const { error } = await eliminarInscripcionCatedra(inscripcionId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      if (catedraId) {
        queryClient.invalidateQueries({ queryKey: ["catedras", catedraId, "estudiantes"] });
      }
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      queryClient.invalidateQueries({ queryKey: ["acuerdos"] });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      toast.success("Estudiante eliminado de la cátedra");
    },
    onError: (error) => toast.error(error.message),
  });
}
