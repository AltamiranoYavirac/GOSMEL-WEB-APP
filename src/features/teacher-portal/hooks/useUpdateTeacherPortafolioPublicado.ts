"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTeacherPortafolioPublicado } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useUpdateTeacherPortafolioPublicado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portafolioId, publicado }: { portafolioId: string; publicado: boolean }) => {
      const { error } = await updateTeacherPortafolioPublicado(portafolioId, publicado);
      if (error) throw new Error(error);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
      toast.success(variables.publicado ? "Elemento visible en tu perfil" : "Elemento oculto");
    },
    onError: (error) => toast.error(error.message),
  });
}
