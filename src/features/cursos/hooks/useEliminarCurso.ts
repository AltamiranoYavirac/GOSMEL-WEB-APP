"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarCurso } from "../api/eliminarCurso";
import { cursosQueryKeys } from "../model/query-keys";

export function useEliminarCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { error } = await eliminarCurso(cursoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["catedras"] });
      toast.success("Curso eliminado exitosamente");
    },
    onError: (error) => toast.error(error.message),
  });
}
