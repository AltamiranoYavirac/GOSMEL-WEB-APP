"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { asociarCursoPrograma } from "../api/getProgramaDetalle";
import { programasQueryKeys } from "../model/query-keys";

export function useAsociarCursoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cursoId, orden }: { cursoId: string; orden?: number }) => {
      const { error } = await asociarCursoPrograma(programaId, cursoId, orden);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
