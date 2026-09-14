export { default as AsignacionesList } from "./ui/AsignacionesList";
export type { IAsignacionDocente, IAsignacionRow, IAsignacionesData } from "./model/asignacion.types";
export { docentesCompatibles, instrumentosRequeridos, opcionesDocentePara } from "./model/compatibilidad";
export { useAsignaciones } from "./hooks/useAsignaciones";
export { useReasignarCatedras } from "./hooks/useReasignarCatedras";
