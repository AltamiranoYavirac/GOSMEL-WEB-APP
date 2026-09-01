"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { aprobarMatricula } from "../api/aprobarMatricula";
import { catedrasQueryKeys } from "../model/query-keys";
import type { IAprobarMatriculaFormValues } from "../model/AprobarMatriculaForm.config";

export function useAprobarMatricula(catedraId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IAprobarMatriculaFormValues) => {
      const { data, error } = await aprobarMatricula({
        p_inscripcion_id: values.inscripcionId,
        p_monto_mensual: values.montoMensual,
        p_dia_cobro: values.diaCobro,
        p_motivo_ajuste: values.motivoAjuste || undefined,
      });
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.inscripcionesPendientes(catedraId) });
      toast.success("Matrícula aprobada");
    },
    onError: (error) => toast.error(error.message),
  });
}