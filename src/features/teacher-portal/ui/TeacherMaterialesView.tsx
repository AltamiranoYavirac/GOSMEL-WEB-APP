"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AdminDataTable,
  AdminPageHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  type IAdminColumn,
} from "@/shared/ui";

import { useDeleteTeacherMaterial } from "../hooks/useDeleteTeacherMaterial";
import { useTeacherMateriales } from "../hooks/useTeacherMateriales";
import {
  MATERIAL_TIPO_BADGE,
  type ITeacherMaterial,
} from "../model/teacher-dashboard.types";
import CrearMaterialTeacherDialog from "./CrearMaterialTeacherDialog";
import type { ITeacherMaterialesViewProps } from "./TeacherMaterialesView.types";

export default function TeacherMaterialesView({ className }: ITeacherMaterialesViewProps) {
  const { data = [], isPending } = useTeacherMateriales();
  const deleteMutation = useDeleteTeacherMaterial();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<ITeacherMaterial | null>(null);

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMutation.mutateAsync(materialToDelete.id);
      toast.success("Material eliminado correctamente");
      setMaterialToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar material";
      toast.error(msg);
    }
  };

  const columns: IAdminColumn<ITeacherMaterial>[] = [
    {
      key: "titulo",
      label: "Título",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-foreground">{row.titulo}</span>
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={MATERIAL_TIPO_BADGE[row.tipo].variant}>
          {MATERIAL_TIPO_BADGE[row.tipo].label}
        </Badge>
      ),
    },
    {
      key: "destino",
      label: "Destino",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.destino ?? "General"}</span>
      ),
    },
    {
      key: "visibilidad",
      label: "Visibilidad",
      render: (row) => (
        <span className="capitalize text-xs text-muted-foreground">{row.visibilidad}</span>
      ),
    },
    {
      key: "recurso",
      label: "Recurso",
      render: (row) => {
        const link = row.storagePath || row.urlExterna;
        if (!link) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Icon icon="ph:arrow-square-out" className="size-3.5" />
              Abrir
            </a>
          </Button>
        );
      },
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMaterialToDelete(row)}
          className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Icon icon="ph:trash" className="size-4" />
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Materiales de Clase"
        description="Comparte guías, partituras, recursos sonoros o enlaces externos con tus alumnos y cátedras."
        icon="ph:file-audio"
      >
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Icon icon="ph:plus-circle" className="size-4" />
          Subir Material
        </Button>
      </AdminPageHeader>

      <AdminDataTable
        data={data}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.titulo, (row) => row.destino ?? ""]}
        emptyTitle="Sin materiales subidos"
        emptyDescription="Puedes cargar partituras o documentos con el botón 'Subir Material'."
        countLabel="materiales"
      />

      <CrearMaterialTeacherDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {materialToDelete ? (
        <AlertDialog open={Boolean(materialToDelete)} onOpenChange={(open) => !open && setMaterialToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar material?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el archivo o enlace &ldquo;{materialToDelete.titulo}&rdquo;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}
