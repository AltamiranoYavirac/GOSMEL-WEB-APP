"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeacherFormacion } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useDeleteTeacherFormacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteTeacherFormacion(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
