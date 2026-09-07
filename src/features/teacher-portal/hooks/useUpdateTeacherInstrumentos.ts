"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateTeacherInstrumentos,
  type ITeacherInstrumentoUpdateItem,
} from "../api";
import { teacherQueryKeys } from "../model/query-keys";

export function useUpdateTeacherInstrumentos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: ITeacherInstrumentoUpdateItem[]) => {
      const { error } = await updateTeacherInstrumentos(items);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherQueryKeys.perfil() });
    },
  });
}
