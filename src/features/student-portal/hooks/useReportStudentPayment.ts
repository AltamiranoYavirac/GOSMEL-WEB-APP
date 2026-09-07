"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reportStudentPayment, type IReportStudentPaymentInput } from "../api/reportStudentPayment";
import { studentQueryKeys } from "../model/query-keys";

export function useReportStudentPayment(estudianteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IReportStudentPaymentInput) => {
      const { data, error } = await reportStudentPayment(input);
      if (error || !data) throw new Error(error ?? "No se pudo reportar el pago");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.finanzas(estudianteId) });
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.overview(estudianteId) });
      queryClient.invalidateQueries({ queryKey: ["cobranza"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Pago reportado, queda en revisión de tesorería");
    },
    onError: (error) => toast.error(error.message),
  });
}