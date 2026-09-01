"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAcuerdo } from "../api/updateAcuerdo";
import type { IEditarAcuerdoFormValues } from "../model/EditarAcuerdoForm.config";
import { acuerdosQueryKeys } from "../model/query-keys";

import { toast } from "sonner";

export function useUpdateAcuerdo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ acuerdoId, values }: { acuerdoId: string; values: IEditarAcuerdoFormValues }) => {
      const { data, error } = await updateAcuerdo(acuerdoId, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: acuerdosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["cuotas"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      toast.success("Acuerdo de pago actualizado");
    },
    onError: (error) => toast.error(error.message),
  });
}
