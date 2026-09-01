"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateUsuarioContacto } from "../api/updateUsuarioContacto";
import { usuariosQueryKeys } from "../model/query-keys";
import type { IEditarContactoFormValues } from "../model/EditarContactoForm.config";

export function useUpdateUsuarioContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: IEditarContactoFormValues }) => {
      const { data, error } = await updateUsuarioContacto(id, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
      toast.success("Contacto actualizado");
    },
    onError: (error) => toast.error(error.message),
  });
}