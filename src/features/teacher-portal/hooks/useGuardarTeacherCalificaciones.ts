"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  guardarTeacherCalificaciones,
  type IGuardarTeacherCalificacionItem,
} from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useGuardarTeacherCalificaciones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      evaluacionId,
      calificaciones,
    }: {
      evaluacionId: string;
      calificaciones: IGuardarTeacherCalificacionItem[];
    }) => {
      const { error } = await guardarTeacherCalificaciones(evaluacionId, calificaciones);
      if (error) throw new Error(error);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: teacherQueryKeys.calificaciones(variables.evaluacionId),
      });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.evaluaciones() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.estudiantes() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
