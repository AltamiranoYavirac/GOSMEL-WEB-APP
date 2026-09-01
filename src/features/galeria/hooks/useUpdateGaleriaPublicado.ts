"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateGaleriaPublicado } from "../api/updateGaleriaPublicado";
import { galeriaQueryKeys } from "../model/query-keys";

export function useUpdateGaleriaPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await updateGaleriaPublicado(id, publicado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galeriaQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}