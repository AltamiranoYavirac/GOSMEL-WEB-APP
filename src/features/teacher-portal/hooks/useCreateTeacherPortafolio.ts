"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherPortafolio } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherPortafolioFormValues } from "../model/TeacherPortafolioForm.config";

export function useCreateTeacherPortafolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherPortafolioFormValues) => {
      const { data, error } = await createTeacherPortafolio(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
