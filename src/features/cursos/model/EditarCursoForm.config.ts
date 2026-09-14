import { z } from "zod";

import type { TablesUpdate } from "@/shared/api/supabase/database.types";

import {
  CATEGORIA_CURSO_OPCIONES,
  MODALIDAD_OPCIONES,
  NIVEL_OPCIONES,
} from "./CrearCursoForm.config";
import type { ICursoDetalle } from "./curso.types";

export const NIVEL_CURSO_OPCIONES = NIVEL_OPCIONES;
export const MODALIDAD_CURSO_OPCIONES = MODALIDAD_OPCIONES;
export const CATEGORIA_EDITAR_CURSO_OPCIONES = CATEGORIA_CURSO_OPCIONES;

export const editarCursoFormSchema = z
  .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    resumen: z.string().trim().optional(),
    descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
    instrumentoId: z.string().trim().optional(),
    categoria: z.enum(["instrumento", "lenguaje_musical", "otro"]),
    nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
    modalidad: z.enum(["presencial", "virtual", "hibrido"]),
    orden: z.number().int().min(0, "El orden debe ser mayor o igual a 0"),
    duracionSemanas: z.number().int().positive("Duración inválida").nullable().optional(),
    duracionPermanente: z.boolean(),
    horasTotales: z.number().int().positive("Horas inválidas").nullable().optional(),
    precioReferencial: z.number().nonnegative("Precio inválido").nullable().optional(),
    etiquetaPrecio: z.string().trim().optional(),
    mostrarPrecio: z.boolean(),
    portadaPublicId: z.string(),
    portadaArchivo: z.instanceof(File).nullable().optional(),
    quitarPortada: z.boolean(),
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

    const tienePortada = Boolean(values.portadaArchivo || (values.portadaPublicId && !values.quitarPortada));
    if (tienePortada && !values.portadaTextoAlt) {
      ctx.addIssue({ code: "custom", path: ["portadaTextoAlt"], message: "Describe la imagen de portada" });
    }
    if (!values.publicado) return;

    const requiredFields = [
      ["resumen", values.resumen],
      ["portadaPublicId", tienePortada],
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

export type IEditarCursoFormValues = z.infer<typeof editarCursoFormSchema>;

export function getEditarCursoFormDefaults(): IEditarCursoFormValues {
  return {
    nombre: "",
    resumen: "",
    descripcion: "",
    instrumentoId: "",
    categoria: "otro",
    nivel: "basico",
    modalidad: "presencial",
    orden: 0,
    duracionSemanas: null,
    duracionPermanente: false,
    horasTotales: null,
    precioReferencial: null,
    etiquetaPrecio: "",
    mostrarPrecio: false,
    portadaPublicId: "",
    portadaArchivo: null,
    quitarPortada: false,
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

export function mapCursoDetalleToFormValues(detalle: ICursoDetalle): IEditarCursoFormValues {
  return {
    nombre: detalle.nombre,
    resumen: detalle.resumen,
    descripcion: detalle.descripcion,
    instrumentoId: detalle.instrumentoId,
    categoria: detalle.categoria,
    nivel: detalle.nivel,
    modalidad: detalle.modalidad,
    orden: detalle.orden,
    duracionSemanas: detalle.duracionSemanas ? Number(detalle.duracionSemanas) : null,
    duracionPermanente: !detalle.duracionSemanas,
    horasTotales: detalle.horasTotales ? Number(detalle.horasTotales) : null,
    precioReferencial: detalle.precioReferencial ? Number(detalle.precioReferencial) : null,
    etiquetaPrecio: detalle.etiquetaPrecio,
    mostrarPrecio: detalle.mostrarPrecio,
    portadaPublicId: detalle.portadaPublicId,
    portadaArchivo: null,
    quitarPortada: false,
    portadaTextoAlt: detalle.portadaTextoAlt,
    publicoEdad: detalle.publicoEdad,
    publicoNivel: detalle.publicoNivel,
    formatoClase: detalle.formatoClase,
    horarioResumen: detalle.horarioResumen,
    cierreEtapa: detalle.cierreEtapa,
    ctaTitulo: detalle.ctaTitulo,
    ctaDescripcion: detalle.ctaDescripcion,
    ctaPrimarioTexto: detalle.ctaPrimarioTexto,
    ctaSecundarioTexto: detalle.ctaSecundarioTexto,
    publicado: detalle.publicado,
  };
}

export function buildEditarCursoPayload(
  values: IEditarCursoFormValues,
  portadaPublicId: string | null = values.quitarPortada ? null : values.portadaPublicId || null
): TablesUpdate<"cursos"> {
  return {
    nombre: values.nombre,
    resumen: values.resumen?.trim() || null,
    descripcion: values.descripcion,
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
    portada_texto_alt: portadaPublicId ? values.portadaTextoAlt?.trim() || null : null,
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
