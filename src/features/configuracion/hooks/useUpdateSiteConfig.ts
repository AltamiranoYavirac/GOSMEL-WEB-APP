"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { siteConfigQueryKeys, updateSiteConfig } from "@/entities/site-config";

import { buildSiteConfigPayload, type ISiteConfigFormValues } from "../model/SiteConfigForm.config";

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ISiteConfigFormValues) => {
      const { data, error } = await updateSiteConfig(buildSiteConfigPayload(values));
      if (error || !data) throw new Error(error ?? "No se pudo guardar la configuración.");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteConfigQueryKeys.detail() });
      toast.success("Configuración guardada");
    },
    onError: (error) => toast.error(error.message),
  });
}
