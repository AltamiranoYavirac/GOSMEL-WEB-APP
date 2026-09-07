"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherEvaluacion } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherEvaluacionFormValues } from "../model/TeacherEvaluacionForm.config";

export function useCreateTeacherEvaluacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherEvaluacionFormValues) => {
      const { data, error } = await createTeacherEvaluacion(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.evaluaciones() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
