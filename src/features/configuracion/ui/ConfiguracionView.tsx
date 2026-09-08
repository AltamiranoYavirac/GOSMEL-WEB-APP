"use client";

import { Icon } from "@iconify/react";

import { AdminPageHeader, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import { useConfiguracion } from "../hooks/useConfiguracion";
import ConfiguracionField from "./ConfiguracionField";

export default function ConfiguracionView() {
  const { data, isPending } = useConfiguracion();

  if (isPending) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Sitio · GOSMEL"
          title="Configuración del sitio"
          description="Datos de contacto, redes sociales y horario de atención de la academia."
          icon="ph:gear-six"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Sitio · GOSMEL"
          title="Configuración del sitio"
          description="Datos de contacto, redes sociales y horario de atención de la academia."
          icon="ph:gear-six"
        />
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon icon="ph:gear-six" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin configuración</p>
          <p className="text-sm text-muted-foreground">Aún no se han registrado los datos del sitio.</p>
        </div>
      </div>
    );
  }

  const redes = data.redesSociales && typeof data.redesSociales === "object" && !Array.isArray(data.redesSociales)
    ? Object.entries(data.redesSociales as Record<string, unknown>).filter(([, value]) => typeof value === "string")
    : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Configuración del sitio"
        description="Datos de contacto, redes sociales y horario de atención de la academia."
        icon="ph:gear-six"
      />

      <Card>
        <CardHeader>
          <CardTitle>Contacto y redes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ConfiguracionField label="Dirección" icon="ph:map-pin" value={data.direccion ?? "—"} />
          <ConfiguracionField label="Ciudad" icon="ph:buildings" value={data.ciudad ?? "—"} />
          <ConfiguracionField label="Teléfono" icon="ph:phone" value={data.telefono ?? "—"} />
          <ConfiguracionField label="WhatsApp" icon="ph:whatsapp-logo" value={data.whatsapp ?? "—"} />
          <ConfiguracionField label="Email general" icon="ph:envelope-simple" value={data.emailGeneral ?? "—"} />
          <ConfiguracionField label="Email de admisiones" icon="ph:envelope" value={data.emailAdmisiones ?? "—"} />
          <ConfiguracionField label="Horario de atención" icon="ph:clock" value={data.horarioAtencion ?? "—"} />
          <ConfiguracionField
            label="Redes sociales"
            icon="ph:share-network"
            value={
              redes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {redes.map(([nombre, url]) => (
                    <a
                      key={nombre}
                      href={url as string}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted"
                    >
                      <Icon icon="ph:link" className="size-3" aria-hidden="true" />
                      {nombre}
                    </a>
                  ))}
                </div>
              ) : (
                "—"
              )
            }
          />
          <ConfiguracionField
            label="Mapa embed"
            icon="ph:map-trifold"
            value={
              data.mapaEmbed ? (
                <a
                  href={data.mapaEmbed}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-3 hover:underline"
                >
                  Ver mapa
                  <Icon icon="ph:arrow-square-out" className="size-3.5" aria-hidden="true" />
                </a>
              ) : (
                "—"
              )
            }
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Última actualización: {formatDateTime(data.actualizado)}</p>
    </div>
  );
}