"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeacherPortafolio } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useDeleteTeacherPortafolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteTeacherPortafolio(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
