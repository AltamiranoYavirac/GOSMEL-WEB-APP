"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSesionEstado, eliminarSesion } from "../api/updateSesionEstado";
import type { TEstadoSesion } from "../model/horario.types";
import { horariosQueryKeys } from "../model/query-keys";

export function useUpdateSesionEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sesionId, estado }: { sesionId: string; estado: TEstadoSesion }) => {
      const { error } = await updateSesionEstado(sesionId, estado);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.sesiones() });
    },
  });
}

export function useEliminarSesion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sesionId: string) => {
      const { error } = await eliminarSesion(sesionId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.sesiones() });
    },
  });
}
