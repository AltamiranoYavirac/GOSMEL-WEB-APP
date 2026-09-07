"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleFavorite } from "../api/toggleFavorite";
import { studentQueryKeys } from "../model/query-keys";

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { data, error } = await toggleFavorite(cursoId);
      if (error || !data) throw new Error(error ?? "No se pudo actualizar el favorito");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.favoritos() });
      toast.success(data.favorito ? "Curso agregado a favoritos" : "Curso quitado de favoritos");
    },
    onError: (error) => toast.error(error.message),
  });
}