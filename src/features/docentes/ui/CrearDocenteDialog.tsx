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
  AlertDialogTrigger,
  Button,
  Checkbox,
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
import { useCreateDocente } from "../hooks/useCreateDocente";
import type { ICrearDocenteDialogProps } from "./CrearDocenteDialog.types";

interface IPerfilOption {
  id: string;
  nombre: string;
  email: string | null;
}

interface IInstrumentoOption {
  id: string;
  nombre: string;
}

export default function CrearDocenteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: ICrearDocenteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const [perfiles, setPerfiles] = useState<IPerfilOption[]>([]);
  const [instrumentos, setInstrumentos] = useState<IInstrumentoOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [perfilId, setPerfilId] = useState("");
  const [slug, setSlug] = useState("");
  const [titulo, setTitulo] = useState("");
  const [experiencia, setExperiencia] = useState("3");
  const [frase, setFrase] = useState("");
  const [biografia, setBiografia] = useState("");
  const [instrumentoId, setInstrumentoId] = useState("");
  const [publicado, setPublicado] = useState(true);
  const [destacado, setDestacado] = useState(false);

  const createMutation = useCreateDocente();

  useEffect(() => {
    if (!open) return;
    const fetchOptions = async () => {
      setLoadingOptions(true);
      const supabase = createSupabaseBrowserClient();

      const [profsRes, docsRes, estsRes] = await Promise.all([
        supabase.from("perfiles").select("id, nombres, apellidos, email").limit(200),
        supabase.from("docentes").select("perfil_id"),
        supabase.from("estudiantes").select("perfil_id"),
      ]);

      const docIds = new Set((docsRes.data ?? []).map((d) => d.perfil_id));
      const estIds = new Set((estsRes.data ?? []).map((e) => e.perfil_id));

      const disponibles = (profsRes.data ?? [])
        .filter((p) => !docIds.has(p.id) && !estIds.has(p.id))
        .map((p) => ({
          id: p.id,
          nombre: `${p.nombres} ${p.apellidos}`.trim(),
          email: p.email,
        }));
      setPerfiles(disponibles);

      const { data: insts } = await supabase
        .from("instrumentos")
        .select("id, nombre")
        .eq("activo", true)
        .order("nombre");
      setInstrumentos(insts ?? []);

      setLoadingOptions(false);
    };

    fetchOptions();
  }, [open]);

  const handlePerfilChange = (id: string) => {
    setPerfilId(id);
    const selected = perfiles.find((p) => p.id === id);
    if (selected && !slug) {
      const generatedSlug = selected.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfilId || !slug.trim()) return;

    createMutation.mutate(
      {
        perfil_id: perfilId,
        slug,
        titulo_profesional: titulo || undefined,
        anios_experiencia: parseInt(experiencia, 10) || 0,
        frase_destacada: frase || undefined,
        biografia: biografia || undefined,
        instrumento_id: instrumentoId || undefined,
        publicado,
        destacado,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setPerfilId("");
          setSlug("");
          setTitulo("");
          setFrase("");
          setBiografia("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button className="gap-2">
            <Icon icon="ph:plus" width={16} height={16} aria-hidden="true" />
            Nuevo Docente
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:chalkboard-teacher" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">Habilitar y Registrar Docente</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Seleccione el usuario registrado para otorgarle el rol de docente y configurar su perfil profesional.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {loadingOptions ? (
            <div className="py-12 flex justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="perfil-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Usuario Registrado *
                </Label>
                <Select value={perfilId} onValueChange={handlePerfilChange}>
                  <SelectTrigger id="perfil-select" className="h-11">
                    <SelectValue placeholder="Seleccione usuario de la academia..." />
                  </SelectTrigger>
                  <SelectContent>
                    {perfiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre} {p.email ? `(${p.email})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-slug">Slug Público (URL) *</Label>
                <Input
                  id="doc-slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej. maestro-carlos-perez"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-titulo">Título Profesional</Label>
                <Input
                  id="doc-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Licenciado en Música, Concertista..."
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-inst">Instrumento Principal</Label>
                <Select value={instrumentoId} onValueChange={setInstrumentoId}>
                  <SelectTrigger id="doc-inst" className="h-10">
                    <SelectValue placeholder="Seleccione instrumento..." />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentos.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-exp">Años de Experiencia</Label>
                <Input
                  id="doc-exp"
                  type="number"
                  min={0}
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="doc-frase">Frase Destacada</Label>
                <Input
                  id="doc-frase"
                  value={frase}
                  onChange={(e) => setFrase(e.target.value)}
                  placeholder="Ej. 'La disciplina en el piano transforma el alma.'"
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="doc-bio">Biografía / Trayectoria</Label>
                <Textarea
                  id="doc-bio"
                  rows={4}
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  placeholder="Breve reseña sobre su trayectoria artística y pedagógica..."
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="doc-pub"
                    checked={publicado}
                    onCheckedChange={(c) => setPublicado(Boolean(c))}
                  />
                  <Label htmlFor="doc-pub" className="text-xs cursor-pointer font-medium">
                    Publicar en la facultad del sitio web
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="doc-dest"
                    checked={destacado}
                    onCheckedChange={(c) => setDestacado(Boolean(c))}
                  />
                  <Label htmlFor="doc-dest" className="text-xs cursor-pointer font-medium">
                    Destacar en la página de inicio
                  </Label>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={createMutation.isPending || !perfilId} className="h-10 px-6 font-semibold">
              {createMutation.isPending && <Spinner className="size-4 mr-2" />}
              Guardar Docente
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
