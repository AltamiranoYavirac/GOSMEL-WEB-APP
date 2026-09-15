"use client"

import { Icon } from "@iconify/react"

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton, Spinner } from "@/shared/ui"
import { Form, TextField, useAppForm } from "@/shared/form"

import { useMiRepresentante } from "../hooks/useMiRepresentante"
import { useUpdateMiRepresentante } from "../hooks/useUpdateMiRepresentante"
import {
  datosRepresentanteFormSchema,
  getDatosRepresentanteFormDefaults,
  mapMiRepresentanteToFormValues,
  type IDatosRepresentanteFormValues,
} from "../model/DatosRepresentanteForm.config"
import type { IDatosRepresentanteCardProps } from "./DatosRepresentanteCard.types"

export default function DatosRepresentanteCard({ perfilId }: IDatosRepresentanteCardProps) {
  const miRepresentante = useMiRepresentante(perfilId)
  const updateMiRepresentante = useUpdateMiRepresentante(perfilId)

  const form = useAppForm<IDatosRepresentanteFormValues>({
    schema: datosRepresentanteFormSchema,
    values: miRepresentante.data
      ? mapMiRepresentanteToFormValues(miRepresentante.data)
      : getDatosRepresentanteFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  })

  if (miRepresentante.isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Perfil de representante</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!miRepresentante.data) {
    return null
  }

  const onSubmit = (values: IDatosRepresentanteFormValues) => {
    updateMiRepresentante.mutate(values)
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Perfil de representante</CardTitle>
        <CardDescription>Datos de contacto adicionales.</CardDescription>
      </CardHeader>
      <Form form={form} onSubmit={onSubmit} id="datos-representante-form">
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="ocupacion"
            label="Ocupación"
            startIcon={<Icon icon="ph:briefcase" className="size-4" aria-hidden="true" />}
          />
          <TextField
            name="direccion"
            label="Dirección"
            startIcon={<Icon icon="ph:map-pin" className="size-4" aria-hidden="true" />}
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form="datos-representante-form" disabled={updateMiRepresentante.isPending}>
            {updateMiRepresentante.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </CardFooter>
      </Form>
    </Card>
  )
}
