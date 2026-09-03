"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherReconocimiento } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherReconocimientoFormValues } from "../model/TeacherReconocimientoForm.config";

export function useCreateTeacherReconocimiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherReconocimientoFormValues) => {
      const { data, error } = await createTeacherReconocimiento(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
