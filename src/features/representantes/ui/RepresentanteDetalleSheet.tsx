"use client";

import { Icon } from "@iconify/react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Spinner,
} from "@/shared/ui";
import { formatCurrency, initialsOf } from "@/shared/lib/formatters";
import { useRepresentanteDetalle } from "../hooks/useRepresentanteDetalle";
import type { IRepresentanteDetalleSheetProps } from "./RepresentanteDetalleSheet.types";

export default function RepresentanteDetalleSheet({
  representanteId,
  open,
  onOpenChange,
  onEdit,
  onMatricularHijo,
}: IRepresentanteDetalleSheetProps) {
  const { data: rep, isPending } = useRepresentanteDetalle(open ? representanteId : null);

  const cleanPhone = rep?.celular?.replace(/\D/g, "") ?? "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/593${cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
        `Hola ${rep?.nombre}, le saludamos de GOSMEL Music Academy.`
      )}`
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl md:max-w-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border/40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="text-base font-bold">
                  {rep ? initialsOf(rep.nombre) : "RP"}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-lg font-bold">{rep?.nombre ?? "Cargando..."}</SheetTitle>
                <SheetDescription className="text-xs">
                  {rep?.ocupacion ? `${rep.ocupacion} · ` : ""}Ficha de tutor y representante familiar
                </SheetDescription>
              </div>
            </div>
            {onEdit && rep && (
              <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
                <Icon icon="ph:pencil-simple" width={14} height={14} aria-hidden="true" />
                Editar
              </Button>
            )}
          </div>
        </SheetHeader>

        {isPending ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : !rep ? (
          <div className="flex-1 p-6 text-center text-muted-foreground">
            No se encontró información del representante.
          </div>
        ) : (
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/50 bg-background/50 p-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Teléfono
                  </span>
                  <span className="text-xs font-semibold">{rep.celular ?? "—"}</span>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/50 p-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Cédula / DNI
                  </span>
                  <span className="text-xs font-semibold">{rep.cedula ?? "—"}</span>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/50 p-3 sm:col-span-1 col-span-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Cuenta en portal
                  </span>
                  <Badge variant={rep.perfil_id ? "default" : "outline"} className="mt-0.5 text-[10px]">
                    {rep.perfil_id ? "Con cuenta activa" : "Sin cuenta (presencial)"}
                  </Badge>
                </div>
                {rep.email && (
                  <div className="rounded-xl border border-border/50 bg-background/50 p-3 col-span-2 sm:col-span-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Correo Electrónico
                    </span>
                    <span className="text-xs font-semibold">{rep.email}</span>
                  </div>
                )}
                {rep.direccion && (
                  <div className="rounded-xl border border-border/50 bg-background/50 p-3 col-span-2 sm:col-span-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Dirección
                    </span>
                    <span className="text-xs font-semibold">{rep.direccion}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {whatsappUrl && (
                  <Button asChild variant="outline" size="sm" className="gap-2 text-emerald-600 dark:text-emerald-400">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Icon icon="ph:whatsapp-logo" width={16} height={16} aria-hidden="true" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                )}
                {onMatricularHijo && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onMatricularHijo(rep.id)}
                  >
                    <Icon icon="ph:student" width={16} height={16} aria-hidden="true" />
                    Matricular otro familiar
                  </Button>
                )}
              </div>

              {rep.total_saldo_familiar > 0 && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                      Saldo Total Vencido de la Familia
                    </span>
                    <span className="text-lg font-bold text-rose-700 dark:text-rose-300">
                      {formatCurrency(rep.total_saldo_familiar)}
                    </span>
                  </div>
                  <Badge variant="destructive">En mora</Badge>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-tight">Estudiantes a Cargo ({rep.representados.length})</h3>
                </div>

                {rep.representados.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-xl">
                    No tiene estudiantes asociados actualmente.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {rep.representados.map((hijo) => (
                      <Card key={hijo.id} className="border-border/60 bg-background/40">
                        <CardContent className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-foreground">{hijo.nombre}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {hijo.parentesco}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                            <div>
                              <span>Edad: </span>
                              <strong className="text-foreground font-medium">{hijo.edad} años</strong>
                            </div>
                            <div>
                              <span>Cátedra: </span>
                              <strong className="text-foreground font-medium">
                                {hijo.catedra_nombre ?? "Sin cátedra activa"}
                              </strong>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
