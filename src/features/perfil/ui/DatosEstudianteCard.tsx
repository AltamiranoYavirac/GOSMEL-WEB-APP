"use client"

import { Icon } from "@iconify/react"

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton, Spinner } from "@/shared/ui"
import { Form, TextareaField, useAppForm } from "@/shared/form"

import { useMiEstudiante } from "../hooks/useMiEstudiante"
import { useUpdateMiEstudiante } from "../hooks/useUpdateMiEstudiante"
import {
  datosEstudianteFormSchema,
  getDatosEstudianteFormDefaults,
  mapMiEstudianteToFormValues,
  type IDatosEstudianteFormValues,
} from "../model/DatosEstudianteForm.config"
import type { IDatosEstudianteCardProps } from "./DatosEstudianteCard.types"

export default function DatosEstudianteCard({ perfilId }: IDatosEstudianteCardProps) {
  const miEstudiante = useMiEstudiante(perfilId)
  const updateMiEstudiante = useUpdateMiEstudiante(perfilId)

  const form = useAppForm<IDatosEstudianteFormValues>({
    schema: datosEstudianteFormSchema,
    values: miEstudiante.data ? mapMiEstudianteToFormValues(miEstudiante.data) : getDatosEstudianteFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  })

  if (miEstudiante.isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Perfil de estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!miEstudiante.data) {
    return null
  }

  const onSubmit = (values: IDatosEstudianteFormValues) => {
    updateMiEstudiante.mutate(values)
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Perfil de estudiante</CardTitle>
        <CardDescription>Cuéntanos un poco sobre ti.</CardDescription>
      </CardHeader>
      <Form form={form} onSubmit={onSubmit} id="datos-estudiante-form">
        <CardContent>
          <TextareaField name="biografiaCorta" label="Biografía corta" placeholder="Escribe algo sobre ti" rows={4} />
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form="datos-estudiante-form" disabled={updateMiEstudiante.isPending}>
            {updateMiEstudiante.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </CardFooter>
      </Form>
    </Card>
  )
}
