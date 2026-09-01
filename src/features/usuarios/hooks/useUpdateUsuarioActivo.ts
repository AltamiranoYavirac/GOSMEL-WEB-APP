"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateUsuarioActivo } from "../api/updateUsuarioActivo";
import { usuariosQueryKeys } from "../model/query-keys";

export function useUpdateUsuarioActivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await updateUsuarioActivo(id, activo);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}