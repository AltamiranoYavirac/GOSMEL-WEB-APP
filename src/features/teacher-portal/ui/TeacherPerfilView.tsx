"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AdminPageHeader,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import {
  Form,
  NumberField,
  TextField,
  TextareaField,
  useAppForm,
} from "@/shared/form";

import { useDeleteTeacherFormacion } from "../hooks/useDeleteTeacherFormacion";
import { useDeleteTeacherPortafolio } from "../hooks/useDeleteTeacherPortafolio";
import { useDeleteTeacherReconocimiento } from "../hooks/useDeleteTeacherReconocimiento";
import { useTeacherPerfil } from "../hooks/useTeacherPerfil";
import { useUpdateTeacherPerfil } from "../hooks/useUpdateTeacherPerfil";
import {
  getTeacherPerfilFormDefaults,
  mapTeacherPerfilToFormValues,
  teacherPerfilFormSchema,
  type ITeacherPerfilFormValues,
} from "../model/TeacherPerfilForm.config";
import CrearFormacionDialog from "./CrearFormacionDialog";
import CrearPortafolioDialog from "./CrearPortafolioDialog";
import CrearReconocimientoDialog from "./CrearReconocimientoDialog";
import GestionarInstrumentosDialog from "./GestionarInstrumentosDialog";
import type { ITeacherPerfilViewProps } from "./TeacherPerfilView.types";

export default function TeacherPerfilView({ className }: ITeacherPerfilViewProps) {
  const { data, isPending } = useTeacherPerfil();
  const updatePerfilMutation = useUpdateTeacherPerfil();
  const deleteFormacionMutation = useDeleteTeacherFormacion();
  const deleteReconocimientoMutation = useDeleteTeacherReconocimiento();
  const deletePortafolioMutation = useDeleteTeacherPortafolio();

  const [formacionDialogOpen, setFormacionDialogOpen] = useState(false);
  const [reconocimientoDialogOpen, setReconocimientoDialogOpen] = useState(false);
  const [portafolioDialogOpen, setPortafolioDialogOpen] = useState(false);
  const [instrumentosDialogOpen, setInstrumentosDialogOpen] = useState(false);

  const form = useAppForm<ITeacherPerfilFormValues>({
    schema: teacherPerfilFormSchema,
    defaultValues: getTeacherPerfilFormDefaults(),
  });

  useEffect(() => {
    if (data) {
      form.reset(mapTeacherPerfilToFormValues(data));
    }
  }, [data, form]);

  const handleUpdateGeneral = async (values: ITeacherPerfilFormValues) => {
    try {
      await updatePerfilMutation.mutateAsync(values);
      toast.success("Perfil profesional actualizado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar perfil";
      toast.error(msg);
    }
  };

  const handleDeleteFormacion = async (id: string) => {
    try {
      await deleteFormacionMutation.mutateAsync(id);
      toast.success("Formación eliminada");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  const handleDeleteReconocimiento = async (id: string) => {
    try {
      await deleteReconocimientoMutation.mutateAsync(id);
      toast.success("Reconocimiento eliminado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  const handleDeletePortafolio = async (id: string) => {
    try {
      await deletePortafolioMutation.mutateAsync(id);
      toast.success("Elemento eliminado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Portal · Docente"
          title="Mi Perfil Profesional"
          description="Cargando información de tu perfil..."
          icon="ph:user-circle"
        />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <AdminPageHeader
        eyebrow="Portal · Docente"
        title="Mi Perfil Profesional"
        description="Gestiona tu biografía pública, formación académica, distinciones artísticas, enlaces de portafolio e instrumentos que impartes."
        icon="ph:user-circle"
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="general">Información</TabsTrigger>
          <TabsTrigger value="formacion">Formación</TabsTrigger>
          <TabsTrigger value="reconocimientos">Reconocimientos</TabsTrigger>
          <TabsTrigger value="portafolio">Portafolio</TabsTrigger>
          <TabsTrigger value="instrumentos">Instrumentos</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Datos Profesionales y Redes
              </CardTitle>
              <CardDescription>
                Esta información se muestra en tu perfil de la academia y en el catálogo docente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form form={form} onSubmit={handleUpdateGeneral} id="docente-perfil-form">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      name="tituloProfesional"
                      label="Título profesional"
                      placeholder="Ej. Concertista de Piano y Teclados"
                    />
                    <NumberField
                      name="aniosExperiencia"
                      label="Años de experiencia docente / musical"
                      asNumber
                    />
                  </div>

                  <TextField
                    name="fraseDestacada"
                    label="Frase destacada o lema musical"
                    placeholder="Ej. La música es el puente entre la disciplina y la emoción."
                  />

                  <TextareaField
                    name="biografia"
                    label="Biografía artística"
                    placeholder="Describe tu trayectoria, estudios, orquestas o experiencia..."
                  />

                  <div className="border-t border-border/50 pt-4">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Redes Sociales y Enlaces
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        name="instagram"
                        label="Instagram (usuario o url)"
                        placeholder="@usuario o https://instagram.com/..."
                      />
                      <TextField
                        name="youtube"
                        label="Canal de YouTube"
                        placeholder="https://youtube.com/@..."
                      />
                      <TextField
                        name="linkedin"
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/..."
                      />
                      <TextField
                        name="facebook"
                        label="Facebook"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={updatePerfilMutation.isPending}
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formacion">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Formación Académica
                </CardTitle>
                <CardDescription>
                  Títulos, estudios en conservatorios o certificaciones musicales.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setFormacionDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Icon icon="ph:plus" className="size-4" />
                Agregar Título
              </Button>
            </CardHeader>
            <CardContent>
              {!data?.formacion || data.formacion.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No has registrado formación académica aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.formacion.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{item.titulo}</h4>
                        <p className="text-xs text-muted-foreground">{item.institucion}</p>
                        {item.anioInicio || item.anioFin ? (
                          <span className="font-mono text-[11px] text-primary">
                            {item.anioInicio ?? "—"} – {item.anioFin ?? "Presente"}
                          </span>
                        ) : null}
                        {item.descripcion ? (
                          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                            {item.descripcion}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFormacion(item.id)}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Icon icon="ph:trash" className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconocimientos">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Reconocimientos y Premios
                </CardTitle>
                <CardDescription>
                  Premios, participaciones destacadas en festivales o distinciones culturales.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setReconocimientoDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Icon icon="ph:plus" className="size-4" />
                Agregar Premio
              </Button>
            </CardHeader>
            <CardContent>
              {!data?.reconocimientos || data.reconocimientos.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No has registrado premios o reconocimientos aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.reconocimientos.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{item.titulo}</h4>
                        {item.entidadOtorgante ? (
                          <p className="text-xs text-muted-foreground">{item.entidadOtorgante}</p>
                        ) : null}
                        {item.anio ? (
                          <span className="font-mono text-[11px] text-primary">{item.anio}</span>
                        ) : null}
                        {item.descripcion ? (
                          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                            {item.descripcion}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReconocimiento(item.id)}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Icon icon="ph:trash" className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portafolio">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Portafolio Multimedia
                </CardTitle>
                <CardDescription>
                  Muestras de presentaciones en vivo, grabaciones de audio o videos.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setPortafolioDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Icon icon="ph:plus" className="size-4" />
                Agregar Elemento
              </Button>
            </CardHeader>
            <CardContent>
              {!data?.portafolio || data.portafolio.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No has agregado elementos a tu portafolio aún.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.portafolio.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize text-[10px]">
                            {item.tipo}
                          </Badge>
                          <h4 className="truncate text-xs font-semibold text-foreground">
                            {item.titulo}
                          </h4>
                        </div>
                        {item.urlExterna ? (
                          <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
                            {item.urlExterna}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between border-t border-border/40 pt-2">
                        {item.urlExterna ? (
                          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                            <a
                              href={item.urlExterna}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <Icon icon="ph:arrow-square-out" className="size-3.5" />
                              Ver medio
                            </a>
                          </Button>
                        ) : <span />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePortafolio(item.id)}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        >
                          <Icon icon="ph:trash" className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instrumentos">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Instrumentos que Impartes
                </CardTitle>
                <CardDescription>
                  Instrumentos asignados en la academia y designación de principal o secundario.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setInstrumentosDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Icon icon="ph:pencil-simple" className="size-4" />
                Gestionar Instrumentos
              </Button>
            </CardHeader>
            <CardContent>
              {!data?.instrumentos || data.instrumentos.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No tienes instrumentos asignados. Haz clic en &ldquo;Gestionar Instrumentos&rdquo; para agregarlos.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {data.instrumentos.map((inst) => (
                    <div
                      key={inst.instrumentoId}
                      className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3.5 py-2 shadow-xs"
                    >
                      <Icon icon="ph:guitar" className="size-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">{inst.nombre}</span>
                      <Badge
                        variant={inst.esPrincipal ? "default" : "outline"}
                        className="text-[10px]"
                      >
                        {inst.esPrincipal ? "Principal" : "Secundario"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CrearFormacionDialog
        open={formacionDialogOpen}
        onOpenChange={setFormacionDialogOpen}
      />

      <CrearReconocimientoDialog
        open={reconocimientoDialogOpen}
        onOpenChange={setReconocimientoDialogOpen}
      />

      <CrearPortafolioDialog
        open={portafolioDialogOpen}
        onOpenChange={setPortafolioDialogOpen}
      />

      <GestionarInstrumentosDialog
        open={instrumentosDialogOpen}
        onOpenChange={setInstrumentosDialogOpen}
        instrumentosActuales={data?.instrumentos ?? []}
      />
    </div>
  );
}
