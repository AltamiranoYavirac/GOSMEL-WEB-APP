"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCuota, type IUpdateCuotaInput } from "../api/updateCuota";
import { cuotasQueryKeys } from "../model/query-keys";

export function useUpdateCuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IUpdateCuotaInput) => {
      const { data, error } = await updateCuota(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Cuota actualizada");
    },
    onError: (error) => toast.error(error.message),
  });
}
