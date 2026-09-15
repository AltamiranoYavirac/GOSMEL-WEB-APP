"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarResponsableAcuerdo } from "../api/cambiarResponsableAcuerdo";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useCambiarResponsableAcuerdo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Parameters<typeof cambiarResponsableAcuerdo>[0]) => {
      const result = await cambiarResponsableAcuerdo(input);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: acuerdosQueryKeys.all }),
  });
}
