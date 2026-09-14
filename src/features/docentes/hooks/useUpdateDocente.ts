"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reemplazarInstrumentosDocente } from "../api/reemplazarInstrumentosDocente";
import { updateDocente, type IUpdateDocentePatch } from "../api/updateDocente";
import { docentesQueryKeys } from "../model/query-keys";

interface IUpdateDocenteVariables {
  id: string;
  patch: IUpdateDocentePatch;
  instrumentos?: { instrumentoIds: string[]; instrumentoPrincipalId?: string };
}

export function useUpdateDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch, instrumentos }: IUpdateDocenteVariables) => {
      const { data, error } = await updateDocente(id, patch);
      if (error) throw new Error(error);

      if (instrumentos) {
        const resultado = await reemplazarInstrumentosDocente({ docenteId: id, ...instrumentos });
        if (resultado.error) throw new Error(resultado.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docentesQueryKeys.all });
      toast.success("Perfil docente actualizado");
    },
    onError: (error) => toast.error(error.message),
  });
}
