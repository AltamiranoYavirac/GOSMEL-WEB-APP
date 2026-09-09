import type { useCalificacionesEvaluacion } from "../hooks/useCalificacionesEvaluacion";
import type { useGuardarCalificaciones } from "../hooks/useGuardarCalificaciones";

export interface ICalificacionesEditorProps {
  data: NonNullable<ReturnType<typeof useCalificacionesEvaluacion>["data"]>;
  notaMaxima: number;
  mutation: ReturnType<typeof useGuardarCalificaciones>;
  onSaved: () => void;
}
