"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { asignarRolAdmin } from "../api/asignarRolAdmin";
import { usuariosQueryKeys } from "../model/query-keys";

export function useAsignarRolAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (perfilId: string) => {
      const { data, error } = await asignarRolAdmin(perfilId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
      toast.success("Rol de administrador asignado");
    },
    onError: (error) => toast.error(error.message),
  });
}
