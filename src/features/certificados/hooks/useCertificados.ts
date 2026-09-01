"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCertificados } from "../api/getCertificados";
import {
  emitirCertificado as emitirCertificadoApi,
  eliminarCertificado as eliminarCertificadoApi,
  getInscripcionesParaCertificados as getInscripcionesApi,
} from "../api/emitirCertificado";
import type { ICertificadoFormValues } from "../model/CertificadoForm.config";
import { certificadosQueryKeys } from "../model/query-keys";

export function useCertificados() {
  return useQuery({
    queryKey: certificadosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCertificados();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useInscripcionesParaCertificados(enabled = true) {
  return useQuery({
    queryKey: [...certificadosQueryKeys.all, "inscripciones-candidatas"],
    queryFn: async () => {
      const { data, error } = await getInscripcionesApi();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    enabled,
  });
}

export function useEmitirCertificado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICertificadoFormValues) => {
      const { data, error } = await emitirCertificadoApi(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificadosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...certificadosQueryKeys.all, "inscripciones-candidatas"] });
    },
  });
}

export function useEliminarCertificado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificadoId: string) => {
      const { error } = await eliminarCertificadoApi(certificadoId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificadosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...certificadosQueryKeys.all, "inscripciones-candidatas"] });
    },
  });
}
