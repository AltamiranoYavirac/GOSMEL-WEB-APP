"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTestimonio } from "../api/updateTestimonio";
import { testimoniosQueryKeys } from "../model/query-keys";
import type { IUpdateTestimonioInput } from "./useUpdateTestimonio.types";

export function useUpdateTestimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: IUpdateTestimonioInput) => {
      const { data, error } = await updateTestimonio(id, values);
      if (error || !data) throw new Error(error ?? "No se pudo actualizar el testimonio.");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimoniosQueryKeys.list() }),
  });
}
