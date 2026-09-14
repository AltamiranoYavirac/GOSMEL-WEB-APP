import { z } from "zod";

import type { TablesUpdate } from "@/shared/api/supabase/database.types";

import type { ISiteAssetAdminRow } from "./site-asset-admin.types";

export const siteAssetFormSchema = z
  .object({
    publicId: z.string(),
    file: z.instanceof(File).nullable().optional(),
    removeImage: z.boolean(),
    alt: z.string().trim().optional(),
    published: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const hasImage = Boolean(values.file || (values.publicId && !values.removeImage));
    if (hasImage && !values.alt) {
      ctx.addIssue({ code: "custom", path: ["alt"], message: "Describe la imagen" });
    }
  });

export type ISiteAssetFormValues = z.infer<typeof siteAssetFormSchema>;

export function mapSiteAssetToFormValues(asset: ISiteAssetAdminRow): ISiteAssetFormValues {
  return {
    publicId: asset.publicId ?? "",
    file: null,
    removeImage: false,
    alt: asset.alt,
    published: asset.published,
  };
}

export function buildSiteAssetPayload(
  values: ISiteAssetFormValues,
  publicId: string | null
): TablesUpdate<"activos_sitio"> {
  return {
    public_id: publicId,
    texto_alt: publicId ? values.alt?.trim() || null : null,
    publicado: values.published,
  };
}
