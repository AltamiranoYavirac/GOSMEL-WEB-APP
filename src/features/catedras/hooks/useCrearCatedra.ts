"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearCatedra } from "../api/crearCatedra";
import { catedrasQueryKeys } from "../model/query-keys";
import type { ICrearCatedraFormValues } from "../model/CrearCatedraForm.config";

export function useCrearCatedra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICrearCatedraFormValues) => {
      const { data, error } = await crearCatedra(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catedrasQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...catedrasQueryKeys.all, "options"] });
      toast.success("Cátedra creada");
    },
    onError: (error) => toast.error(error.message),
  });
}