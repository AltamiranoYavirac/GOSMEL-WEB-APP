"use client";

import { Icon } from "@iconify/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from "@/shared/ui";

import { useCursoTemario } from "../hooks/useCursoTemario";
import type { ICursoTemarioSheetProps } from "./CursoTemarioSheet.types";

export default function CursoTemarioSheet({
  cursoId,
  cursoNombre,
  open,
  onOpenChange,
}: ICursoTemarioSheetProps) {
  const { data, isPending } = useCursoTemario(cursoId, open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon icon="ph:book-open-text" className="size-5 text-primary" />
            Temario Oficial · {cursoNombre}
          </SheetTitle>
          <SheetDescription>
            Guía académica y lecciones configuradas por la administración (D-12 · Solo lectura).
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-6">
          {isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !data || data.modulos.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Icon icon="ph:notebook" className="size-8 opacity-40" />
              <p className="text-sm font-medium">Este curso aún no tiene temario registrado</p>
              <p className="text-xs">El administrador lo definirá en el plan curricular.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Accordion type="multiple" className="space-y-3">
                {data.modulos.map((modulo, index) => (
                  <AccordionItem
                    key={modulo.id}
                    value={modulo.id}
                    className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-tint font-mono text-xs font-bold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{modulo.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {modulo.lecciones.length} lección{modulo.lecciones.length !== 1 ? "es" : ""}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border/40 px-4 pt-3 pb-4">
                      {modulo.descripcion ? (
                        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                          {modulo.descripcion}
                        </p>
                      ) : null}

                      {modulo.lecciones.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          Sin lecciones detalladas en este módulo.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {modulo.lecciones.map((leccion, lIdx) => (
                            <div
                              key={leccion.id}
                              className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-muted/40 p-2.5"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[11px] text-muted-foreground">
                                    {lIdx + 1}.
                                  </span>
                                  <p className="text-xs font-medium text-foreground">
                                    {leccion.titulo}
                                  </p>
                                  {leccion.esMuestra ? (
                                    <Badge variant="outline" className="text-[10px]">
                                      Muestra
                                    </Badge>
                                  ) : null}
                                </div>
                                {leccion.descripcion ? (
                                  <p className="mt-1 text-[11px] text-muted-foreground">
                                    {leccion.descripcion}
                                  </p>
                                ) : null}
                              </div>
                              {leccion.duracionMinutos ? (
                                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                                  {leccion.duracionMinutos} min
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
