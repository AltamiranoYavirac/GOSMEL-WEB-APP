"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  guardarTeacherAsistencias,
  type IGuardarTeacherAsistenciaItem,
} from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useGuardarTeacherAsistencias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sesionId,
      asistencias,
    }: {
      sesionId: string;
      asistencias: IGuardarTeacherAsistenciaItem[];
    }) => {
      const { error } = await guardarTeacherAsistencias(sesionId, asistencias);
      if (error) throw new Error(error);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: teacherQueryKeys.sesionAsistencia(variables.sesionId),
      });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.sesiones() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.estudiantes() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
