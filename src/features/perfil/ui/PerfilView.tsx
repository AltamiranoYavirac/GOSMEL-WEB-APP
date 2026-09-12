"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { ROLE_LABEL, sessionQueryKeys } from "@/entities/user"
import {
  AdminPageHeader,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataLabel,
  ImageUploadField,
} from "@/shared/ui"

import { useEliminarAvatar } from "../hooks/useEliminarAvatar"
import type { IPerfilViewProps } from "./PerfilView.types"

export default function PerfilView({ session }: IPerfilViewProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const eliminarAvatar = useEliminarAvatar()

  const handleAvatarChange = (value: string) => {
    if (!value) {
      eliminarAvatar.mutate()
      return
    }
    queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Panel · Cuenta"
        title="Mi cuenta"
        description="Gestiona tu foto de perfil y revisa los datos de tu cuenta."
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
              endpoint="/api/upload/avatar"
              compress
              value={session.avatarPublicId}
              onChange={handleAvatarChange}
              helperText="JPG, PNG o WEBP · Máx. 2MB (se optimiza automáticamente)"
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
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <DataLabel>Nombre</DataLabel>
              <p className="text-sm font-medium text-foreground">{session.displayName}</p>
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
        </Card>
      </div>
    </div>
  )
}
