"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearMaterial } from "../api/crearMaterial";
import { materialesQueryKeys } from "../model/query-keys";
import type { ICrearMaterialFormValues } from "../model/CrearMaterialForm.config";

export function useCrearMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICrearMaterialFormValues) => {
      const { data, error } = await crearMaterial(values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialesQueryKeys.list() });
      toast.success("Material creado");
    },
    onError: (error) => toast.error(error.message),
  });
}