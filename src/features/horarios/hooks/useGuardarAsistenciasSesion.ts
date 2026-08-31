"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { guardarAsistenciasSesion, type IGuardarAsistenciaPayload } from "../api/guardarAsistenciasSesion";
import { horariosQueryKeys } from "../model/query-keys";

export function useGuardarAsistenciasSesion(sesionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asistencias: IGuardarAsistenciaPayload[]) => {
      const { error } = await guardarAsistenciasSesion(sesionId, asistencias);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...horariosQueryKeys.all, "asistencias", sesionId] });
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.sesiones() });
    },
  });
}
