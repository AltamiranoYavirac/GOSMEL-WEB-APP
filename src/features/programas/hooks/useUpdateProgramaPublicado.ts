"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProgramaPublicado } from "../api/updateProgramaPublicado";
import { programasQueryKeys } from "../model/query-keys";

export function useUpdateProgramaPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await updateProgramaPublicado(id, publicado);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
    onError: (error) => toast.error(error.message),
  });
}