import { z } from "zod";

import type { Database, TablesInsert } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TCategoriaCurso = Database["public"]["Enums"]["categoria_curso"];

export const NIVEL_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export const MODALIDAD_OPCIONES: ISelectFieldOption[] = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];

export const CATEGORIA_CURSO_OPCIONES: ISelectFieldOption[] = [
  { value: "instrumento", label: "Instrumento" },
  { value: "lenguaje_musical", label: "Lenguaje musical" },
  { value: "otro", label: "Otro" },
];

export const crearCursoFormSchema = z
  .object({
    nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().trim().min(10, "Describe el curso con al menos 10 caracteres"),
    resumen: z.string().trim().optional(),
    categoria: z.enum(["instrumento", "lenguaje_musical", "otro"]),
    nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
    modalidad: z.enum(["presencial", "virtual", "hibrido"]),
    instrumentoId: z.string().trim().optional(),
    orden: z.number().int().min(0, "El orden debe ser mayor o igual a 0"),
    duracionSemanas: z.number().int().min(1, "Duración inválida").nullable().optional(),
    duracionPermanente: z.boolean(),
    horasTotales: z.number().int().min(1, "Horas inválidas").nullable().optional(),
    precioReferencial: z.number().nonnegative("Precio inválido").nullable().optional(),
    etiquetaPrecio: z.string().trim().optional(),
    mostrarPrecio: z.boolean(),
    portadaArchivo: z.instanceof(File).nullable().optional(),
    portadaTextoAlt: z.string().trim().optional(),
    publicoEdad: z.string().trim().optional(),
    publicoNivel: z.string().trim().optional(),
    formatoClase: z.string().trim().optional(),
    horarioResumen: z.string().trim().optional(),
    cierreEtapa: z.string().trim().optional(),
    ctaTitulo: z.string().trim().optional(),
    ctaDescripcion: z.string().trim().optional(),
    ctaPrimarioTexto: z.string().trim().optional(),
    ctaSecundarioTexto: z.string().trim().optional(),
    publicado: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.categoria === "instrumento" && !values.instrumentoId) {
      ctx.addIssue({ code: "custom", path: ["instrumentoId"], message: "Selecciona un instrumento" });
    }
    if (values.mostrarPrecio && (values.precioReferencial === null || values.precioReferencial === undefined)) {
      ctx.addIssue({ code: "custom", path: ["precioReferencial"], message: "Ingresa el precio para mostrarlo" });
    }
    if (values.mostrarPrecio && !values.etiquetaPrecio) {
      ctx.addIssue({ code: "custom", path: ["etiquetaPrecio"], message: "Ingresa la etiqueta de precio para mostrarla" });
    }
    if (values.portadaArchivo && !values.portadaTextoAlt) {
      ctx.addIssue({ code: "custom", path: ["portadaTextoAlt"], message: "Describe la imagen de portada" });
    }
    if (!values.publicado) return;

    const requiredFields = [
      ["resumen", values.resumen],
      ["portadaArchivo", values.portadaArchivo],
      ["portadaTextoAlt", values.portadaTextoAlt],
      ["publicoEdad", values.publicoEdad],
      ["publicoNivel", values.publicoNivel],
      ["formatoClase", values.formatoClase],
      ["horarioResumen", values.horarioResumen],
      ["cierreEtapa", values.cierreEtapa],
      ["ctaTitulo", values.ctaTitulo],
      ["ctaDescripcion", values.ctaDescripcion],
      ["ctaPrimarioTexto", values.ctaPrimarioTexto],
      ["ctaSecundarioTexto", values.ctaSecundarioTexto],
    ] as const;

    for (const [path, value] of requiredFields) {
      if (!value) ctx.addIssue({ code: "custom", path: [path], message: "Completa este campo para publicar" });
    }
  });

export type ICrearCursoFormValues = z.infer<typeof crearCursoFormSchema>;

export function getCrearCursoFormDefaults(initial?: Partial<ICrearCursoFormValues>): ICrearCursoFormValues {
  return {
    nombre: "",
    descripcion: "",
    resumen: "",
    categoria: "instrumento",
    nivel: "basico",
    modalidad: "presencial",
    instrumentoId: "",
    orden: initial?.orden ?? 1,
    duracionSemanas: null,
    duracionPermanente: false,
    horasTotales: null,
    precioReferencial: null,
    etiquetaPrecio: "",
    mostrarPrecio: false,
    portadaArchivo: null,
    portadaTextoAlt: "",
    publicoEdad: "",
    publicoNivel: "",
    formatoClase: "",
    horarioResumen: "",
    cierreEtapa: "",
    ctaTitulo: "",
    ctaDescripcion: "",
    ctaPrimarioTexto: "Reservar clase de prueba",
    ctaSecundarioTexto: "Ver otros cursos",
    publicado: false,
  };
}

export function buildCrearCursoPayload(
  values: ICrearCursoFormValues,
  slug: string,
  portadaPublicId: string | null
): TablesInsert<"cursos"> {
  return {
    nombre: values.nombre.trim(),
    slug,
    resumen: values.resumen?.trim() || null,
    descripcion: values.descripcion.trim(),
    instrumento_id: values.categoria === "instrumento" ? values.instrumentoId || null : null,
    categoria: values.categoria,
    nivel: values.nivel,
    modalidad: values.modalidad,
    orden: values.orden,
    duracion_semanas: values.duracionPermanente ? null : (values.duracionSemanas ?? null),
    horas_totales: values.duracionPermanente ? null : (values.horasTotales ?? null),
    precio_referencial: values.precioReferencial ?? null,
    etiqueta_precio: values.etiquetaPrecio?.trim() || null,
    mostrar_precio: values.mostrarPrecio,
    portada_public_id: portadaPublicId,
    portada_texto_alt: values.portadaTextoAlt?.trim() || null,
    publico_edad: values.publicoEdad?.trim() || null,
    publico_nivel: values.publicoNivel?.trim() || null,
    formato_clase: values.formatoClase?.trim() || null,
    horario_resumen: values.horarioResumen?.trim() || null,
    cierre_etapa: values.cierreEtapa?.trim() || null,
    cta_titulo: values.ctaTitulo?.trim() || null,
    cta_descripcion: values.ctaDescripcion?.trim() || null,
    cta_primario_texto: values.ctaPrimarioTexto?.trim() || null,
    cta_secundario_texto: values.ctaSecundarioTexto?.trim() || null,
    publicado: values.publicado,
  };
}
