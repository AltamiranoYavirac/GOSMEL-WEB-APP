"use client";

import { AdminPageHeader, Skeleton } from "@/shared/ui";

import { useSiteAssetsAdmin } from "../hooks/useSiteAssetsAdmin";
import SiteAssetCard from "./SiteAssetCard";

export default function SiteAssetsList() {
  const { data, isPending } = useSiteAssetsAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Imágenes del sitio"
        description="Reemplaza las imágenes fijas de la landing y páginas públicas sin editar código."
        icon="ph:image-square"
      />
      {isPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {(data ?? []).map((asset) => <SiteAssetCard key={asset.key} asset={asset} />)}
        </div>
      )}
    </div>
  );
}
