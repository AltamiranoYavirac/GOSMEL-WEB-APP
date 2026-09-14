"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { generarSesionesCatedra, type IGenerarSesionesInput } from "../api/generarSesionesCatedra";
import { horariosQueryKeys } from "../model/query-keys";

export function useGenerarSesionesCatedra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IGenerarSesionesInput) => {
      const { data, error } = await generarSesionesCatedra(input);
      if (error) throw new Error(error);
      return data ?? 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: horariosQueryKeys.all });
      toast.success(`Se generaron ${count} sesiones en el calendario de clases`);
    },
    onError: (error) => {
      toast.error(`Error al generar sesiones: ${error.message}`);
    },
  });
}
