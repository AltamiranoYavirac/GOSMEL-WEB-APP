"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { AdminPageHeader, Badge, Card, CardContent, Input, Skeleton, Switch } from "@/shared/ui";

import { useGaleria } from "../hooks/useGaleria";
import { useUpdateGaleriaPublicado } from "../hooks/useUpdateGaleriaPublicado";
import { CATEGORIA_MEDIO_BADGE, galeriaImageUrl, type IGaleriaMedioRow } from "../model/galeria.types";

const CATEGORIAS = Object.keys(CATEGORIA_MEDIO_BADGE) as IGaleriaMedioRow["categoria"][];

function chipClasses(active: boolean) {
  return cn(
    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
    active
      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
      : "border-border bg-background text-muted-foreground hover:text-foreground"
  );
}

export default function GaleriaList() {
  const { data, isPending } = useGaleria();
  const mutation = useUpdateGaleriaPublicado();
  const [categoria, setCategoria] = useState<string>("all");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    let filtered = data ?? [];
    if (categoria !== "all") {
      filtered = filtered.filter((item) => item.categoria === categoria);
    }
    const query = search.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((item) => (item.titulo ?? "").toLowerCase().includes(query));
    }
    return filtered;
  }, [data, categoria, search]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Galería"
        description="Fotos y videos de instalaciones, conciertos y aulas para el sitio público."
        icon="ph:image"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => setCategoria("all")} aria-pressed={categoria === "all"} className={chipClasses(categoria === "all")}>
            Todos
          </button>
          {CATEGORIAS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategoria(value)}
              aria-pressed={categoria === value}
              className={chipClasses(categoria === value)}
            >
              {CATEGORIA_MEDIO_BADGE[value].label}
            </button>
          ))}
        </div>

        <Input
          icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
          iconPosition="start"
          placeholder="Buscar por título…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full lg:w-72"
        />
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon icon="ph:image" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin medios</p>
          <p className="text-sm text-muted-foreground">Cuando se suban fotos o videos aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="gap-0 overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={galeriaImageUrl(item.publicId, 600)}
                  alt={item.textoAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute right-2 top-2">
                  <Badge variant={CATEGORIA_MEDIO_BADGE[item.categoria].variant}>
                    {CATEGORIA_MEDIO_BADGE[item.categoria].label}
                  </Badge>
                </div>
              </div>
              <CardContent className="flex items-center justify-between gap-3 pt-3">
                <span className="truncate text-sm font-medium">{item.titulo ?? "Sin título"}</span>
                <Switch
                  size="sm"
                  checked={item.publicado}
                  disabled={mutation.isPending}
                  onCheckedChange={(value) => mutation.mutate({ id: item.id, publicado: value })}
                  aria-label={`Publicar o despublicar ${item.titulo ?? "medio"}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}