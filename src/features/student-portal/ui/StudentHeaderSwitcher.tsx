"use client";

import { Icon } from "@iconify/react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useStudentPortal } from "../hooks/useStudentPortal";
import { NIVEL_CURSO_LABEL } from "../model/student-dashboard.types";

function cloudinaryUrl(publicId: string | null): string | null {
  if (!publicId) return null;
  if (publicId.startsWith("http")) return publicId;
  return `https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_200/${publicId}`;
}

export default function StudentHeaderSwitcher() {
  const { isLoading, isRegisteredOnly, estudiantes, estudianteActivo, setEstudianteActivo } = useStudentPortal();

  if (isLoading) {
    return <Skeleton className="h-20 rounded-xl" />;
  }

  if (isRegisteredOnly) {
    return null;
  }

  if (estudiantes.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-accent-muted/40 bg-card p-4">
        <Icon icon="ph:student" className="size-6 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="font-heading text-sm font-semibold text-foreground">Sin estudiantes vinculados</p>
          <p className="text-xs text-muted-foreground">Vincula a tus hijos o regístrate para ver tu información académica.</p>
        </div>
      </div>
    );
  }

  if (!estudianteActivo) return null;

  const avatarUrl = cloudinaryUrl(estudianteActivo.avatarPublicId);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent-muted/40 bg-card p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={estudianteActivo.nombre} /> : null}
            <AvatarFallback>{initialsOf(estudianteActivo.nombre)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-heading text-base font-semibold text-foreground">{estudianteActivo.nombre}</p>
              {estudianteActivo.esMenor ? <Badge variant="secondary">Menor de edad</Badge> : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {estudianteActivo.nivelMusical ? NIVEL_CURSO_LABEL[estudianteActivo.nivelMusical] : "Sin nivel"}{" "}
              {estudianteActivo.instrumentos.length > 0 ? `· ${estudianteActivo.instrumentos.join(", ")}` : ""}
            </p>
          </div>
        </div>

        {estudiantes.length > 1 ? (
          <Select value={estudianteActivo.id} onValueChange={(value) => setEstudianteActivo(value)}>
            <SelectTrigger className="w-full sm:w-64" size="sm">
              <SelectValue placeholder="Selecciona un estudiante" />
            </SelectTrigger>
            <SelectContent>
              {estudiantes.map((estudiante) => (
                <SelectItem key={estudiante.id} value={estudiante.id}>
                  {estudiante.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {!estudianteActivo.esMenor && !estudianteActivo.tieneCuenta ? (
        <Alert>
          <Icon icon="ph:graduation-cap" aria-hidden="true" />
          <AlertTitle>Vincula tu cuenta</AlertTitle>
          <AlertDescription>
            Eres mayor de edad. Solicita al administrador enlazar tu cuenta para gestionar tu expediente directamente.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}