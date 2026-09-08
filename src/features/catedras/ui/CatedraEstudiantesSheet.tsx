"use client";

import { Icon } from "@iconify/react";

import {
  Badge,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";

import { useCatedraEstudiantes } from "../hooks/useCatedraEstudiantes";
import type { ICatedraRow } from "../model/catedra.types";
import CatedraMatriculadoItemRow from "./CatedraMatriculadoItemRow";
import CatedraSolicitudItemCard from "./CatedraSolicitudItemCard";

interface ICatedraEstudiantesSheetProps {
  catedra: ICatedraRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "matriculados" | "pendientes";
}

export default function CatedraEstudiantesSheet({
  catedra,
  open,
  onOpenChange,
  defaultTab = "matriculados",
}: ICatedraEstudiantesSheetProps) {
  const { data, isPending } = useCatedraEstudiantes(catedra?.id ?? "", open);

  if (!catedra) return null;

  const matriculadosCount = data?.matriculados.length ?? catedra.activos;
  const pendientesCount = data?.pendientes.length ?? catedra.pendientes;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl md:max-w-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary">{catedra.codigo}</span>
            <Badge variant="outline" className="text-xs uppercase font-mono">
              {catedra.modalidad}
            </Badge>
          </div>
          <SheetTitle className="font-heading text-xl">{catedra.curso}</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Docente: <strong className="text-foreground">{catedra.docente ?? "Por asignar"}</strong></span>
            {catedra.aula ? <span>Aula: <strong className="text-foreground">{catedra.aula}</strong></span> : null}
            <span>Cupo: <strong className="text-foreground">{matriculadosCount} / {catedra.cupoMaximo}</strong></span>
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 border-b border-border/40">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matriculados" className="gap-2">
                <Icon icon="ph:users" className="size-4" aria-hidden="true" />
                Matriculados
                <Badge variant="secondary" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                  {matriculadosCount}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="pendientes" className="gap-2">
                <Icon icon="ph:clock" className="size-4" aria-hidden="true" />
                Solicitudes
                {pendientesCount > 0 ? (
                  <Badge variant="warning" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                    {pendientesCount}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                    0
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            {isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : (
              <>
                <TabsContent value="matriculados" className="mt-0 space-y-3 outline-none">
                  {data?.matriculados && data.matriculados.length > 0 ? (
                    <div className="space-y-2.5">
                      {data.matriculados.map((estudiante) => (
                        <CatedraMatriculadoItemRow
                          key={estudiante.inscripcionId}
                          catedraId={catedra.id}
                          catedraCodigo={catedra.codigo}
                          estudiante={estudiante}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/60">
                      <Icon icon="ph:users" className="size-8 text-muted-foreground/60 mb-2" aria-hidden="true" />
                      <p className="text-sm font-medium text-foreground">No hay estudiantes matriculados</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Los estudiantes activos en esta cátedra aparecerán en esta lista.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pendientes" className="mt-0 space-y-4 outline-none">
                  {data?.pendientes && data.pendientes.length > 0 ? (
                    <div className="space-y-3">
                      {data.pendientes.map((solicitud) => (
                        <CatedraSolicitudItemCard
                          key={solicitud.inscripcionId}
                          solicitud={solicitud}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/60">
                      <Icon icon="ph:check-circle" className="size-8 text-muted-foreground/60 mb-2" aria-hidden="true" />
                      <p className="text-sm font-medium text-foreground">Sin solicitudes pendientes</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cuando un estudiante o representante solicite unirse a esta cátedra, aparecerá aquí.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
