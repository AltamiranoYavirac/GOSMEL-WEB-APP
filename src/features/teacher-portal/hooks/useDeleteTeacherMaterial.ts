"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeacherMaterial } from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useDeleteTeacherMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const { error } = await deleteTeacherMaterial(materialId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.materiales() });
    },
  });
}
