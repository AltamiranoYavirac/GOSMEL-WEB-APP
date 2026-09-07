"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacherMaterial } from "../api";
import { teacherQueryKeys } from "../model/query-keys";
import type { ITeacherMaterialFormValues } from "../model/TeacherMaterialForm.config";

export function useCreateTeacherMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ITeacherMaterialFormValues) => {
      const { data, error } = await createTeacherMaterial(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.materiales() });
    },
  });
}
