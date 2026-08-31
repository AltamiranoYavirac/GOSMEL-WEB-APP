"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { asignarEstudiante, type IAsignarEstudiantePayload } from "../api/asignarEstudiante";
import { usuariosQueryKeys } from "../model/query-keys";

export function useAsignarEstudiante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      perfilId,
      nombre,
      values,
    }: {
      perfilId: string;
      nombre: string;
      values: IAsignarEstudiantePayload;
    }) => {
      const { data, error } = await asignarEstudiante(perfilId, nombre, values);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["estudiantes", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza", "list"] });
      toast.success("Rol de estudiante asignado");
    },
    onError: (error) => toast.error(error.message),
  });
}