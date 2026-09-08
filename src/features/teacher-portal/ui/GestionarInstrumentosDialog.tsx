"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Checkbox,
  ScrollArea,
  Switch,
} from "@/shared/ui";

import { useTeacherCatalogos } from "../hooks/useTeacherCatalogos";
import { useUpdateTeacherInstrumentos } from "../hooks/useUpdateTeacherInstrumentos";
import type {
  IGestionarInstrumentosDialogProps,
  IInstrumentoOverride,
} from "./GestionarInstrumentosDialog.types";

export default function GestionarInstrumentosDialog({
  open,
  onOpenChange,
  instrumentosActuales,
}: IGestionarInstrumentosDialogProps) {
  const { data: catalogos, isPending } = useTeacherCatalogos(open);
  const updateMutation = useUpdateTeacherInstrumentos();
  const [overrides, setOverrides] = useState<Record<string, IInstrumentoOverride>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOverrides({});
    }
    onOpenChange(nextOpen);
  };

  const actualesMap = new Map(
    instrumentosActuales.map((i) => [i.instrumentoId, i.esPrincipal])
  );

  const items = (catalogos?.instrumentos ?? []).map((inst) => {
    const override = overrides[inst.id];
    const defaultSelected = actualesMap.has(inst.id);
    const defaultPrincipal = actualesMap.get(inst.id) ?? false;
    return {
      instrumentoId: inst.id,
      nombre: inst.nombre,
      selected: override?.selected !== undefined ? override.selected : defaultSelected,
      esPrincipal: override?.esPrincipal !== undefined ? override.esPrincipal : defaultPrincipal,
    };
  });

  const handleToggleSelect = (id: string, currentSelected: boolean) => {
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !currentSelected,
      },
    }));
  };

  const handleTogglePrincipal = (id: string, currentPrincipal: boolean) => {
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        esPrincipal: !currentPrincipal,
      },
    }));
  };

  const handleGuardar = async () => {
    const selectedItems = items
      .filter((i) => i.selected)
      .map((i) => ({
        instrumentoId: i.instrumentoId,
        esPrincipal: i.esPrincipal,
      }));

    try {
      await updateMutation.mutateAsync(selectedItems);
      toast.success("Instrumentos impartidos actualizados");
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar instrumentos";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Icon icon="ph:guitar" className="size-5 text-primary" />
            Instrumentos que impartes
          </AlertDialogTitle>
          <AlertDialogDescription>
            Selecciona los instrumentos musicales en los cuales impartes cátedra e indica si es tu instrumento principal.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-80 py-2 pr-2">
          {isPending ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Cargando catálogo...</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No hay instrumentos disponibles.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.instrumentoId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => handleToggleSelect(item.instrumentoId, item.selected)}
                      id={`inst-${item.instrumentoId}`}
                    />
                    <label
                      htmlFor={`inst-${item.instrumentoId}`}
                      className="cursor-pointer text-xs font-semibold text-foreground"
                    >
                      {item.nombre}
                    </label>
                  </div>

                  {item.selected ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">Principal</span>
                      <Switch
                        checked={item.esPrincipal}
                        onCheckedChange={() => handleTogglePrincipal(item.instrumentoId, item.esPrincipal)}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            onClick={handleGuardar}
            disabled={updateMutation.isPending}
          >
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
