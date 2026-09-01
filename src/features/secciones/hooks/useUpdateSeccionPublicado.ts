"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSeccionPublicado } from "../api/updateSeccionPublicado";
import { seccionesQueryKeys } from "../model/query-keys";

export function useUpdateSeccionPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await updateSeccionPublicado(id, publicado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seccionesQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}