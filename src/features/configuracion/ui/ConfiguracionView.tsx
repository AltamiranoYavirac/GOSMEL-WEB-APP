"use client";

import { Icon } from "@iconify/react";

import { AdminPageHeader, Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Spinner } from "@/shared/ui";
import { Form, TextareaField, TextField, useAppForm } from "@/shared/form";
import { formatDateTime } from "@/shared/lib/formatters";

import { useSiteConfig, type ISiteConfig } from "@/entities/site-config";

import { useUpdateSiteConfig } from "../hooks/useUpdateSiteConfig";
import {
  getSiteConfigFormDefaults,
  siteConfigFormSchema,
  type ISiteConfigFormValues,
} from "../model/SiteConfigForm.config";

const FORM_ID = "configuracion-sitio";

function ConfiguracionForm({ config }: { config: ISiteConfig | null }) {
  const mutation = useUpdateSiteConfig();
  const form = useAppForm<ISiteConfigFormValues>({
    schema: siteConfigFormSchema,
    values: getSiteConfigFormDefaults(config),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Configuración del sitio"
        description="Datos de contacto, redes sociales y horario de atención de la academia."
        icon="ph:gear-six"
      >
        <Button form={FORM_ID} type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:floppy-disk" aria-hidden="true" />}
          Guardar cambios
        </Button>
      </AdminPageHeader>

      <Form form={form} onSubmit={(values: ISiteConfigFormValues) => mutation.mutate(values)} id={FORM_ID} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField name="direccion" label="Dirección" />
            <TextField name="ciudad" label="Ciudad" />
            <TextField name="telefono" label="Teléfono" type="tel" />
            <TextField name="whatsapp" label="WhatsApp" type="tel" />
            <TextField name="emailGeneral" label="Email general" type="email" />
            <TextField name="emailAdmisiones" label="Email de admisiones" type="email" />
            <TextField name="horarioAtencion" label="Horario de atención" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <TextField name="instagram" label="Instagram" type="url" placeholder="https://instagram.com/…" />
            <TextField name="facebook" label="Facebook" type="url" placeholder="https://facebook.com/…" />
            <TextField name="tiktok" label="TikTok" type="url" placeholder="https://tiktok.com/@…" />
            <TextField name="youtube" label="YouTube" type="url" placeholder="https://youtube.com/@…" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mapa</CardTitle>
          </CardHeader>
          <CardContent>
            <TextareaField
              name="mapaEmbed"
              label="URL del mapa embebido"
              rows={2}
              placeholder="https://www.google.com/maps/embed?pb=…"
            />
          </CardContent>
        </Card>
      </Form>

      {config ? (
        <p className="text-xs text-muted-foreground">Última actualización: {formatDateTime(config.actualizado)}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Aún no se han registrado los datos del sitio.</p>
      )}
    </>
  );
}

export default function ConfiguracionView() {
  const { data, isPending } = useSiteConfig();

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

  return (
    <div className="space-y-6">
      <ConfiguracionForm config={data ?? null} />
    </div>
  );
}
