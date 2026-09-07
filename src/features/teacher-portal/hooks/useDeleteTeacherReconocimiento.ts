"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeacherReconocimiento } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useDeleteTeacherReconocimiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteTeacherReconocimiento(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
