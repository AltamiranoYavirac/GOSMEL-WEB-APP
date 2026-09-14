"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  agregarHorarioCatedra,
  eliminarHorarioCatedra,
  getCatedraHorarios,
} from "../api/catedraHorarios";
import { catedrasQueryKeys } from "../model/query-keys";

export function useCatedraHorarios(catedraId: string, enabled = true) {
  return useQuery({
    queryKey: catedrasQueryKeys.horarios(catedraId),
    queryFn: async () => {
      const { data, error } = await getCatedraHorarios(catedraId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    enabled: Boolean(catedraId) && enabled,
  });
}

function useInvalidarHorarios(catedraId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.horarios(catedraId) });
    queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.list() });
  };
}

export function useAgregarHorarioCatedra(catedraId: string) {
  const invalidar = useInvalidarHorarios(catedraId);

  return useMutation({
    mutationFn: async (input: { diaSemana: number; horaInicio: string; horaFin: string }) => {
      const { error } = await agregarHorarioCatedra({ catedraId, ...input });
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      invalidar();
      toast.success("Horario agregado");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEliminarHorarioCatedra(catedraId: string) {
  const invalidar = useInvalidarHorarios(catedraId);

  return useMutation({
    mutationFn: async (horarioId: string) => {
      const { error } = await eliminarHorarioCatedra(horarioId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      invalidar();
      toast.success("Horario eliminado");
    },
    onError: (error) => toast.error(error.message),
  });
}
