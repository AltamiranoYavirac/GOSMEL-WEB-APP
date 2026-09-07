"use client";

import { Icon } from "@iconify/react";

import { AdminPageHeader, Badge, Button, Card, CardContent, Skeleton } from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useStudentCertificates } from "../hooks/useStudentCertificates";
import { useStudentPortal } from "../hooks/useStudentPortal";
import StudentNoStudents from "./StudentNoStudents";

export default function StudentCertificatesView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data: certificados, isPending } = useStudentCertificates(estudianteActivo?.id ?? null);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  const total = certificados?.length ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Certificados"
        description="Tus diplomas oficiales emitidos por la academia."
        icon="ph:certificate"
      />

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon icon="ph:certificate" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin certificados</p>
          <p className="text-sm text-muted-foreground">Cuando culmines una cátedra, tu diploma aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(certificados ?? []).map((certificado) => {
            const href = certificado.storagePath.startsWith("http")
              ? certificado.storagePath
              : `/api/storage?path=${encodeURIComponent(certificado.storagePath)}`;

            return (
              <Card key={certificado.id}>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg font-semibold text-foreground">{certificado.curso}</p>
                      <p className="font-mono text-xs font-semibold text-primary">{certificado.catedra}</p>
                    </div>
                    <Icon icon="ph:award" className="size-8 text-primary" aria-hidden="true" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Emitido {formatDate(certificado.fechaEmision)}</Badge>
                    <Badge variant="outline">Código: {certificado.codigoVerificacion}</Badge>
                  </div>

                  <Button asChild size="sm" className="self-start">
                    <a href={href} target="_blank" rel="noreferrer">
                      <Icon icon="ph:download-simple" aria-hidden="true" />
                      Descargar diploma
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}