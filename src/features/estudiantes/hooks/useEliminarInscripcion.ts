"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarInscripcion } from "../api/eliminarInscripcion";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useEliminarInscripcion(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inscripcionId: string) => {
      const { data, error } = await eliminarInscripcion(inscripcionId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...estudiantesQueryKeys.all, "detalle", estudianteId] });
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["student-portal"] });
      toast.success("Inscripción eliminada");
    },
    onError: (error) => toast.error(error.message),
  });
}
