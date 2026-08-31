"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { generarCuotasMes } from "../api/generarCuotasMes";
import { cuotasQueryKeys } from "../model/query-keys";

export function useGenerarCuotasMes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mes: string) => {
      const { data, error } = await generarCuotasMes(mes);
      if (error) throw new Error(error);
      return data ?? 0;
    },
    onSuccess: (total) => {
      queryClient.invalidateQueries({ queryKey: cuotasQueryKeys.list() });
      toast.success(`${total} cuotas generadas`);
    },
    onError: (error) => toast.error(error.message),
  });
}