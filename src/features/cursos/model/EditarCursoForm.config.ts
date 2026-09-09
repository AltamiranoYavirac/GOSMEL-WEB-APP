import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

import type { IUpdateCursoPatch } from "../api/updateCurso";
import type { ICursoDetalle } from "./curso.types";

export const NIVEL_CURSO_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export const MODALIDAD_CURSO_OPCIONES: ISelectFieldOption[] = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];

export const editarCursoFormSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  resumen: z.string().trim().optional(),
  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
  nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
  modalidad: z.enum(["presencial", "virtual", "hibrido"]),
  duracionSemanas: z.coerce.number().int().positive("Duración inválida").nullable().optional(),
  horasTotales: z.coerce.number().int().positive("Horas inválidas").nullable().optional(),
  precioReferencial: z.coerce.number().nonnegative("Precio inválido").nullable().optional(),
  etiquetaPrecio: z.string().trim().optional(),
  mostrarPrecio: z.boolean(),
  videoIntroUrl: z.union([z.string().trim().url("Ingresa una URL válida"), z.literal("")]).optional(),
  portadaPublicId: z.string().optional(),
  publicado: z.boolean(),
  destacado: z.boolean(),
});

export type IEditarCursoFormValues = z.infer<typeof editarCursoFormSchema>;

export function mapCursoDetalleToFormValues(detalle: ICursoDetalle): IEditarCursoFormValues {
  return {
    nombre: detalle.nombre,
    resumen: detalle.resumen,
    descripcion: detalle.descripcion,
    nivel: detalle.nivel,
    modalidad: detalle.modalidad,
    duracionSemanas: detalle.duracionSemanas ? Number(detalle.duracionSemanas) : null,
    horasTotales: detalle.horasTotales ? Number(detalle.horasTotales) : null,
    precioReferencial: detalle.precioReferencial ? Number(detalle.precioReferencial) : null,
    etiquetaPrecio: detalle.etiquetaPrecio,
    mostrarPrecio: detalle.mostrarPrecio,
    videoIntroUrl: detalle.videoIntroUrl,
    portadaPublicId: detalle.portadaPublicId,
    publicado: detalle.publicado,
    destacado: detalle.destacado,
  };
}

export function buildEditarCursoPayload(values: IEditarCursoFormValues): IUpdateCursoPatch {
  return {
    nombre: values.nombre,
    resumen: values.resumen?.trim() || null,
    descripcion: values.descripcion,
    nivel: values.nivel,
    modalidad: values.modalidad,
    duracion_semanas: values.duracionSemanas ?? null,
    horas_totales: values.horasTotales ?? null,
    precio_referencial: values.precioReferencial ?? null,
    etiqueta_precio: values.etiquetaPrecio?.trim() || null,
    mostrar_precio: values.mostrarPrecio,
    video_intro_url: values.videoIntroUrl?.trim() || null,
    portada_public_id: values.portadaPublicId || null,
    publicado: values.publicado,
    destacado: values.destacado,
  };
}
