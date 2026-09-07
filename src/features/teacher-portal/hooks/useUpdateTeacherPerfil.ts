"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeacherPerfil } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherPerfilFormValues } from "../model/TeacherPerfilForm.config";

export function useUpdateTeacherPerfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherPerfilFormValues) => {
      const { error } = await updateTeacherPerfil(values);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    },
  });
}
