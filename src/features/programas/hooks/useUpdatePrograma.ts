"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePrograma } from "../api/updatePrograma";
import type { IProgramaFormValues } from "../model/ProgramaForm.config";
import { programasQueryKeys } from "../model/query-keys";

export function useUpdatePrograma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ programaId, values }: { programaId: string; values: IProgramaFormValues }) => {
      const { data, error } = await updatePrograma(programaId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programasQueryKeys.list() });
    },
  });
}
