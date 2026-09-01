"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarEstudiante } from "../api/eliminarEstudiante";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useEliminarEstudiante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, perfilId }: { id: string; perfilId: string | null }) => {
      const { data, error } = await eliminarEstudiante(id, perfilId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: estudiantesQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza", "list"] });
      if (result?.deleted) {
        toast.success("Estudiante eliminado");
      } else {
        toast.success("Estudiante desactivado (conserva su historial)");
      }
    },
    onError: (error) => toast.error(error.message),
  });
}