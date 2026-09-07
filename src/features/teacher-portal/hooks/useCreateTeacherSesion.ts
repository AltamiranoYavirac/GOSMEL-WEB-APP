"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherSesion } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherSesionFormValues } from "../model/TeacherSesionForm.config";

export function useCreateTeacherSesion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherSesionFormValues) => {
      const { data, error } = await createTeacherSesion(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.sesiones() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
