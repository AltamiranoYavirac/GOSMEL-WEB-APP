"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeacherSesionEstado } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { TEstadoSesion } from "../model/teacher-dashboard.types";

export function useUpdateTeacherSesionEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sesionId, estado }: { sesionId: string; estado: TEstadoSesion }) => {
      const { error } = await updateTeacherSesionEstado(sesionId, estado);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.sesiones() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
