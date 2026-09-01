"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { quitarRol } from "../api/quitarRol";
import { usuariosQueryKeys } from "../model/query-keys";
import type { TRolUsuario } from "../model/usuario.types";

export function useQuitarRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfilId, rol }: { perfilId: string; rol: TRolUsuario }) => {
      const { data, error } = await quitarRol(perfilId, rol);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: ["docentes", "list"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cobranza", "list"] });
      toast.success("Rol quitado");
    },
    onError: (error) => toast.error(error.message),
  });
}