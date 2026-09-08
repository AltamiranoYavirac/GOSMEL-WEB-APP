export { default as CatedrasList } from "./ui/CatedrasList";
export { default as CrearCatedraDialog } from "./ui/CrearCatedraDialog";
export { default as EditarCatedraDialog } from "./ui/EditarCatedraDialog";
export { default as GenerarSesionesCatedraDialog } from "./ui/GenerarSesionesCatedraDialog";
export { default as CatedraMatriculasDialog } from "./ui/CatedraMatriculasDialog";
export { default as CatedraEstudiantesSheet } from "./ui/CatedraEstudiantesSheet";
export { default as CatedraMatriculadoItemRow } from "./ui/CatedraMatriculadoItemRow";
export { default as CatedraSolicitudItemCard } from "./ui/CatedraSolicitudItemCard";
export * from "./model/catedra.types";
export * from "./model/catedra-estudiantes.types";
export * from "./hooks/useCatedras";
export * from "./hooks/useCrearCatedra";
export * from "./hooks/useUpdateCatedra";
export * from "./hooks/useGenerarSesionesCatedra";
export * from "./hooks/useCatedraOptions";
export * from "./hooks/useCatedraEstudiantes";
export * from "./hooks/useEliminarInscripcionCatedra";
export {
  useInscripcionesPendientes,
  useAprobarMatricula,
  useRechazarMatricula,
  aprobarMatriculaFormSchema,
  getAprobarMatriculaFormDefaults,
} from "@/entities/matricula";
export type { IInscripcionPendiente, IAprobarMatriculaFormValues } from "@/entities/matricula";