import type { useAsistenciasSesion } from "../hooks/useAsistenciasSesion";
import type { useGuardarAsistenciasSesion } from "../hooks/useGuardarAsistenciasSesion";

export interface IAsistenciasEditorProps {
  data: NonNullable<ReturnType<typeof useAsistenciasSesion>["data"]>;
  mutation: ReturnType<typeof useGuardarAsistenciasSesion>;
  onSaved: () => void;
}
