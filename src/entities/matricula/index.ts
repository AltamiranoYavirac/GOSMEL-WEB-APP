export type { IInscripcionPendiente } from "./model/matricula.types";
export { matriculasQueryKeys } from "./model/query-keys";
export {
  aprobarMatriculaFormSchema,
  getAprobarMatriculaFormDefaults,
} from "./model/AprobarMatriculaForm.config";
export type { IAprobarMatriculaFormValues } from "./model/AprobarMatriculaForm.config";
export {
  rechazarMatriculaFormSchema,
  getRechazarMatriculaFormDefaults,
} from "./model/RechazarMatriculaForm.config";
export type { IRechazarMatriculaFormValues } from "./model/RechazarMatriculaForm.config";
export { getInscripcionesPendientes } from "./api/getInscripcionesPendientes";
export { aprobarMatricula } from "./api/aprobarMatricula";
export type { IAprobarMatriculaPayload } from "./api/aprobarMatricula";
export { rechazarMatricula } from "./api/rechazarMatricula";
export { useInscripcionesPendientes } from "./hooks/useInscripcionesPendientes";
export { useAprobarMatricula } from "./hooks/useAprobarMatricula";
export { useRechazarMatricula } from "./hooks/useRechazarMatricula";
export type { IRechazarMatriculaArgs } from "./hooks/useRechazarMatricula";
