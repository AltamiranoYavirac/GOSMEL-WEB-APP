"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
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
  ImageUploadField,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Textarea,
} from "@/shared/ui";
import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import { useUpdateCurso } from "../hooks/useUpdateCurso";
import type { TNivelCurso, TModalidadCurso } from "../model/curso.types";
import type { IEditarCursoDialogProps } from "./EditarCursoDialog.types";

export default function EditarCursoDialog({
  curso,
  open,
  onOpenChange,
  onSuccess,
}: IEditarCursoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [resumen, setResumen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState<TNivelCurso>("basico");
  const [modalidad, setModalidad] = useState<TModalidadCurso>("presencial");
  const [semanas, setSemanas] = useState("");
  const [horas, setHoras] = useState("");
  const [precio, setPrecio] = useState("");
  const [etiquetaPrecio, setEtiquetaPrecio] = useState("");
  const [mostrarPrecio, setMostrarPrecio] = useState(false);
  const [videoIntro, setVideoIntro] = useState("");
  const [portadaPublicId, setPortadaPublicId] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [destacado, setDestacado] = useState(false);

  const updateMutation = useUpdateCurso();

  useEffect(() => {
    if (!open || !curso) return;

    const fetchCurso = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("cursos")
        .select("*")
        .eq("id", curso.id)
        .single();

      if (data) {
        setNombre(data.nombre ?? "");
        setResumen(data.resumen ?? "");
        setDescripcion(data.descripcion ?? "");
        setNivel(data.nivel ?? "basico");
        setModalidad(data.modalidad ?? "presencial");
        setSemanas(data.duracion_semanas ? String(data.duracion_semanas) : "");
        setHoras(data.horas_totales ? String(data.horas_totales) : "");
        setPrecio(data.precio_referencial ? String(data.precio_referencial) : "");
        setEtiquetaPrecio(data.etiqueta_precio ?? "");
        setMostrarPrecio(data.mostrar_precio ?? false);
        setVideoIntro(data.video_intro_url ?? "");
        setPortadaPublicId(data.portada_public_id ?? "");
        setPublicado(data.publicado ?? false);
        setDestacado(data.destacado ?? false);
      }
      setLoading(false);
    };

    fetchCurso();
  }, [open, curso]);

  if (!curso) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) return;

    updateMutation.mutate(
      {
        id: curso.id,
        patch: {
          nombre,
          resumen: resumen || null,
          descripcion,
          nivel,
          modalidad,
          duracion_semanas: semanas ? parseInt(semanas, 10) : null,
          horas_totales: horas ? parseInt(horas, 10) : null,
          precio_referencial: precio ? parseFloat(precio) : null,
          etiqueta_precio: etiquetaPrecio || null,
          mostrar_precio: mostrarPrecio,
          video_intro_url: videoIntro || null,
          portada_public_id: portadaPublicId || null,
          publicado,
          destacado,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-3xl sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:book-open" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">Editar Curso: {curso.nombre}</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Modifique la información académica, comercial y de presentación del curso.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
              <div className="space-y-2 sm:col-span-2">
                <ImageUploadField
                  label="Foto de portada para la web pública"
                  value={portadaPublicId}
                  onChange={setPortadaPublicId}
                  folder="gosmel/cursos"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-curso-nom" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nombre del Curso *
                </Label>
                <Input
                  id="edit-curso-nom"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-10 text-base font-medium"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-curso-res" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Resumen Corto
                </Label>
                <Input
                  id="edit-curso-res"
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  placeholder="Frase breve para tarjetas y catálogo..."
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-curso-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Descripción Completa *
                </Label>
                <Textarea
                  id="edit-curso-desc"
                  required
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-nivel" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nivel
                </Label>
                <Select value={nivel} onValueChange={(v) => setNivel(v as TNivelCurso)}>
                  <SelectTrigger id="edit-curso-nivel" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciacion">Iniciación</SelectItem>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermedio">Intermedio</SelectItem>
                    <SelectItem value="avanzado">Avanzado</SelectItem>
                    <SelectItem value="maestria">Maestría</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-mod" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Modalidad
                </Label>
                <Select value={modalidad} onValueChange={(v) => setModalidad(v as TModalidadCurso)}>
                  <SelectTrigger id="edit-curso-mod" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-sem" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Duración (Semanas)
                </Label>
                <Input
                  id="edit-curso-sem"
                  type="number"
                  min={1}
                  value={semanas}
                  onChange={(e) => setSemanas(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-hrs" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Horas Totales
                </Label>
                <Input
                  id="edit-curso-hrs"
                  type="number"
                  min={1}
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-precio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Precio Referencial ($ USD)
                </Label>
                <Input
                  id="edit-curso-precio"
                  type="number"
                  step="0.01"
                  min={0}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-curso-etiqueta" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Etiqueta de Precio
                </Label>
                <Input
                  id="edit-curso-etiqueta"
                  value={etiquetaPrecio}
                  onChange={(e) => setEtiquetaPrecio(e.target.value)}
                  placeholder="Ej. Desde $40 / mes"
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-curso-video" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  URL Video Intro / Muestra
                </Label>
                <Input
                  id="edit-curso-video"
                  type="url"
                  value={videoIntro}
                  onChange={(e) => setVideoIntro(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-10"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-curso-pub"
                    checked={publicado}
                    onCheckedChange={(c) => setPublicado(Boolean(c))}
                  />
                  <Label htmlFor="edit-curso-pub" className="text-xs cursor-pointer font-medium">
                    Publicar en el catálogo web
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-curso-dest"
                    checked={destacado}
                    onCheckedChange={(c) => setDestacado(Boolean(c))}
                  />
                  <Label htmlFor="edit-curso-dest" className="text-xs cursor-pointer font-medium">
                    Curso destacado
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-curso-verprecio"
                    checked={mostrarPrecio}
                    onCheckedChange={(c) => setMostrarPrecio(Boolean(c))}
                  />
                  <Label htmlFor="edit-curso-verprecio" className="text-xs cursor-pointer font-medium">
                    Mostrar precio en catálogo
                  </Label>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={updateMutation.isPending} className="h-10 px-6 font-semibold">
              {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
              Guardar Cambios
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
