"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { crearCurso } from "../api/crearCurso";
import { cursosQueryKeys } from "../model/query-keys";
import type { ICrearCursoFormValues } from "../model/CrearCursoForm.config";

export function useCrearCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ICrearCursoFormValues) => {
      const result = await persistCloudinaryImage({
        file: values.portadaArchivo,
        folder: "gosmel/cursos",
        persist: (publicId) => crearCurso(values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...cursosQueryKeys.all, "options"] });
      toast.success("Curso creado");
    },
    onError: (error) => toast.error(error.message),
  });
}
