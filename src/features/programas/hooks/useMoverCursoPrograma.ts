"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrdenCursoPrograma } from "../api/getProgramaDetalle";
import { programasQueryKeys } from "../model/query-keys";
import type { IMoverCursoProgramaInput } from "./useMoverCursoPrograma.types";

export function useMoverCursoPrograma(programaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ origen, destino }: IMoverCursoProgramaInput) => {
      const first = await updateOrdenCursoPrograma(programaId, origen.cursoId, destino.orden);
      if (first.error) throw new Error(first.error);
      const second = await updateOrdenCursoPrograma(programaId, destino.cursoId, origen.orden);
      if (second.error) throw new Error(second.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...programasQueryKeys.all, "detalle", programaId] });
    },
  });
}
