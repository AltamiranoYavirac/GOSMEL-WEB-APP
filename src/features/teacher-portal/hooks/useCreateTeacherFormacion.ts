"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherFormacion } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherFormacionFormValues } from "../model/TeacherFormacionForm.config";

export function useCreateTeacherFormacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherFormacionFormValues) => {
      const { data, error } = await createTeacherFormacion(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
