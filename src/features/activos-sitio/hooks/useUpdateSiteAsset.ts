"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistCloudinaryImage } from "@/shared/api/persist-cloudinary-image";

import { updateSiteAsset } from "../api/updateSiteAsset";
import { siteAssetsAdminQueryKeys } from "../model/query-keys";
import type { IUpdateSiteAssetInput } from "./useUpdateSiteAsset.types";

export function useUpdateSiteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, values, currentPublicId }: IUpdateSiteAssetInput) => {
      const result = await persistCloudinaryImage({
        file: values.file,
        folder: "gosmel/sitio",
        currentPublicId,
        removeCurrent: values.removeImage,
        meta: { displayName: `Sitio - ${key}`, tags: [`sitio:${key}`] },
        persist: (publicId) => updateSiteAsset(key, values, publicId),
      });
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: siteAssetsAdminQueryKeys.list() });
      if (result.cleanupError) {
        toast.warning("La imagen se guardó, pero el activo anterior quedó pendiente de limpieza.");
      } else {
        toast.success("Imagen del sitio actualizada");
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
