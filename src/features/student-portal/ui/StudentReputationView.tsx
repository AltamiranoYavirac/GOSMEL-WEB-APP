"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AdminPageHeader, Badge, Button, Card, CardContent, Skeleton } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useStudentCatedras } from "../hooks/useStudentCatedras";
import { useStudentFavorites } from "../hooks/useStudentFavorites";
import { useStudentPortal } from "../hooks/useStudentPortal";
import { useStudentReviews } from "../hooks/useStudentReviews";
import { useToggleFavorite } from "../hooks/useToggleFavorite";
import { NIVEL_CURSO_LABEL } from "../model/student-dashboard.types";
import CrearResenaDialog from "./CrearResenaDialog";
import SolicitarMatriculaDialog from "./SolicitarMatriculaDialog";
import StudentNoStudents from "./StudentNoStudents";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= value ? "ph:star-fill" : "ph:star"}
          className={star <= value ? "size-4 text-primary" : "size-4 text-muted-foreground/50"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function StudentReputationView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: resenas, isPending: resenasPending } = useStudentReviews(estudianteActivo?.id ?? null);
  const { data: catedras } = useStudentCatedras(estudianteActivo?.id ?? null);
  const { data: favoritos, isPending: favoritosPending } = useStudentFavorites();
  const toggleFavorito = useToggleFavorite();

  const [resenaOpen, setResenaOpen] = useState(false);
  const [solicitudOpen, setSolicitudOpen] = useState(false);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || resenasPending || favoritosPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Proyección"
        description="Comparte tu experiencia y planifica tu siguiente paso."
        icon="ph:trend-up"
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setResenaOpen(true)}>
            <Icon icon="ph:star" aria-hidden="true" />
            Valorar curso
          </Button>
          <Button onClick={() => setSolicitudOpen(true)}>
            <Icon icon="ph:plus" aria-hidden="true" />
            Solicitar matrícula
          </Button>
        </div>
      </AdminPageHeader>

      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mis reseñas</p>
          {(resenas ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no has valorado ningún curso.</p>
          ) : (
            (resenas ?? []).map((resena) => (
              <div key={resena.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent-muted/40 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{resena.curso}</p>
                  <Stars value={resena.puntuacion} />
                  {resena.comentario ? <p className="mt-1 text-xs text-muted-foreground">{resena.comentario}</p> : null}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={resena.publicado ? "success" : "secondary"}>
                    {resena.publicado ? "Publicada" : "En moderación"}
                  </Badge>
                  <span className="text-xs text-muted-foreground/70">{formatDate(resena.creadaEn)}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cursos favoritos</p>
          {(favoritos ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes cursos guardados como favoritos.</p>
          ) : (
            (favoritos ?? []).map((favorito) => (
              <div key={favorito.cursoId} className="flex items-center justify-between gap-3 rounded-lg border border-accent-muted/40 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{favorito.nombre}</p>
                  {favorito.nivel ? <p className="text-xs text-muted-foreground">{NIVEL_CURSO_LABEL[favorito.nivel]}</p> : null}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorito.mutate(favorito.cursoId)}
                  disabled={toggleFavorito.isPending}
                >
                  <Icon icon="ph:heart-break" className="text-destructive" aria-hidden="true" />
                  Quitar
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {estudianteActivo ? (
        <CrearResenaDialog
          estudianteId={estudianteActivo.id}
          catedras={catedras ?? []}
          open={resenaOpen}
          onOpenChange={setResenaOpen}
        />
      ) : null}

      <SolicitarMatriculaDialog open={solicitudOpen} onOpenChange={setSolicitudOpen} />
    </div>
  );
}