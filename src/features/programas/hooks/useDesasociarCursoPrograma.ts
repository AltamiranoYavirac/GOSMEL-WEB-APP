"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { desasociarCursoPrograma } from "../api/getProgramaDetalle";
import { programasQueryKeys } from "../model/query-keys";

export function useDesasociarCursoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { error } = await desasociarCursoPrograma(programaId, cursoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
