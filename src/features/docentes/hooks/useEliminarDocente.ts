"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eliminarDocente } from "../api/eliminarDocente";
import { docentesQueryKeys } from "../model/query-keys";

export function useEliminarDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (perfilId: string) => {
      const { data, error } = await eliminarDocente(perfilId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: docentesQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "list"] });
      if (result?.deleted) {
        toast.success("Docente eliminado");
      } else {
        toast.success("Docente desactivado (conserva su historial)");
      }
    },
    onError: (error) => toast.error(error.message),
  });
}