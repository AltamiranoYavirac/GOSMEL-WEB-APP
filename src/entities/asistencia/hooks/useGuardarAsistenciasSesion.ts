"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { guardarAsistenciasSesion } from "../api/guardarAsistenciasSesion";
import type { IGuardarAsistenciaPayload } from "../model/asistencia.types";
import { asistenciaQueryKeys } from "../model/query-keys";

export function useGuardarAsistenciasSesion(sesionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asistencias: IGuardarAsistenciaPayload[]) => {
      const { error } = await guardarAsistenciasSesion(sesionId, asistencias);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenciaQueryKeys.sesion(sesionId) });
    },
  });
}
