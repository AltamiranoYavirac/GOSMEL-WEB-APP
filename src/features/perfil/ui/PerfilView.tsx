"use client"

import { Icon } from "@iconify/react"

import { ROLE_LABEL } from "@/entities/user"
import {
  AdminPageHeader,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  DataLabel,
  ImageUploadField,
  Skeleton,
  Spinner,
} from "@/shared/ui"
import { Form, TextField, useAppForm } from "@/shared/form"

import { useEliminarAvatar } from "../hooks/useEliminarAvatar"
import { useMiPerfil } from "../hooks/useMiPerfil"
import { useSubirAvatar } from "../hooks/useSubirAvatar"
import { useUpdateMiPerfil } from "../hooks/useUpdateMiPerfil"
import {
  datosCuentaFormSchema,
  getDatosCuentaFormDefaults,
  mapMiPerfilToFormValues,
  type IDatosCuentaFormValues,
} from "../model/DatosCuentaForm.config"
import type { IPerfilViewProps } from "./PerfilView.types"

export default function PerfilView({ session }: IPerfilViewProps) {
  const subirAvatar = useSubirAvatar()
  const eliminarAvatar = useEliminarAvatar()
  const miPerfil = useMiPerfil(session.id)
  const updateMiPerfil = useUpdateMiPerfil(session.id)

  const form = useAppForm<IDatosCuentaFormValues>({
    schema: datosCuentaFormSchema,
    values: miPerfil.data ? mapMiPerfilToFormValues(miPerfil.data) : getDatosCuentaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  })

  const onSubmit = (values: IDatosCuentaFormValues) => {
    updateMiPerfil.mutate(values)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Panel · Cuenta"
        title="Mi cuenta"
        description="Gestiona tu foto de perfil y edita los datos de tu cuenta."
        icon="ph:user-circle"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Foto de perfil
            </CardTitle>
            <CardDescription>
              Se muestra en el panel{session.roles.includes("docente") ? " y en el catálogo público de docentes" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadField
              label=""
              value={session.avatarPublicId}
              onFileChange={(file) => {
                if (file) subirAvatar.mutate(file)
              }}
              onRemove={() => eliminarAvatar.mutate()}
              disabled={subirAvatar.isPending || eliminarAvatar.isPending}
              helperText="JPG, PNG o WEBP · Máx. 10 MB"
            />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Datos de la cuenta
            </CardTitle>
            <CardDescription>
              Información vinculada a tu acceso en la plataforma.
            </CardDescription>
          </CardHeader>

          {miPerfil.isLoading ? (
            <CardContent className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          ) : (
            <Form form={form} onSubmit={onSubmit} id="datos-cuenta-form">
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField name="nombres" label="Nombres" />
                  <TextField name="apellidos" label="Apellidos" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    name="cedula"
                    label="Cédula"
                    startIcon={<Icon icon="ph:identification-card" className="size-4" aria-hidden="true" />}
                  />
                  <TextField
                    name="celular"
                    label="Celular"
                    startIcon={<Icon icon="ph:phone" className="size-4" aria-hidden="true" />}
                  />
                </div>
                <div className="space-y-1">
                  <DataLabel>Correo</DataLabel>
                  <p className="text-sm font-medium text-foreground">{session.email}</p>
                </div>
                <div className="space-y-1.5">
                  <DataLabel>Roles</DataLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {session.roles.map((rol) => (
                      <Badge key={rol} variant="outline" className="capitalize">
                        {ROLE_LABEL[rol]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" form="datos-cuenta-form" disabled={updateMiPerfil.isPending}>
                  {updateMiPerfil.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
                  Guardar cambios
                </Button>
              </CardFooter>
            </Form>
          )}
        </Card>
      </div>
    </div>
  )
}
