import { z } from "zod";

import type { TablesInsert, TablesUpdate } from "@/shared/api/supabase/database.types";
import type { IIconPickerOption } from "@/shared/form";

import type { IMetricaRow } from "./metrica.types";

export const METRICA_ICON_OPTIONS: IIconPickerOption[] = [
  { value: "ph:users-three", label: "Estudiantes" },
  { value: "ph:student", label: "Estudiante" },
  { value: "ph:chalkboard-teacher", label: "Docentes" },
  { value: "ph:music-notes", label: "Música" },
  { value: "ph:guitar", label: "Instrumento" },
  { value: "ph:trophy", label: "Logros" },
  { value: "ph:star", label: "Estrellas" },
  { value: "ph:clock", label: "Horario" },
  { value: "ph:calendar-check", label: "Años" },
  { value: "ph:medal", label: "Reconocimientos" },
];

export const metricaFormSchema = z.object({
  etiqueta: z.string().trim().min(2, "Ingresa la etiqueta de la métrica"),
  valor: z.string().trim().min(1, "Ingresa el valor"),
  sufijo: z.string().trim().optional(),
  icono: z.string().trim().optional(),
  orden: z.number().int().min(0, "El orden no puede ser negativo"),
  publicado: z.boolean(),
});

export type IMetricaFormValues = z.infer<typeof metricaFormSchema>;

export function getMetricaFormDefaults(item?: IMetricaRow): IMetricaFormValues {
  return {
    etiqueta: item?.etiqueta ?? "",
    valor: item?.valor ?? "",
    sufijo: item?.sufijo ?? "",
    icono: item?.icono ?? "",
    orden: item?.orden ?? 0,
    publicado: item?.publicado ?? false,
  };
}

export function buildMetricaPayload(values: IMetricaFormValues): TablesInsert<"metricas_academia"> {
  return {
    etiqueta: values.etiqueta.trim(),
    valor: values.valor.trim(),
    sufijo: values.sufijo?.trim() || null,
    icono: values.icono?.trim() || null,
    orden: values.orden,
    publicado: values.publicado,
  };
}

export function buildMetricaUpdatePayload(values: IMetricaFormValues): TablesUpdate<"metricas_academia"> {
  return buildMetricaPayload(values);
}
