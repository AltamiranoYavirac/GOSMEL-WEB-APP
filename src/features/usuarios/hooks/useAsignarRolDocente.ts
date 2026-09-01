"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { asignarRolDocente } from "../api/asignarRolDocente";
import { usuariosQueryKeys } from "../model/query-keys";

export function useAsignarRolDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfilId, nombre }: { perfilId: string; nombre: string }) => {
      const { data, error } = await asignarRolDocente(perfilId, nombre);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["docentes", "list"] });
      toast.success("Rol de docente asignado");
    },
    onError: (error) => toast.error(error.message),
  });
}