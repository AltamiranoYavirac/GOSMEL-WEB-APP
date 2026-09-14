import type { IAsignacionDocente, IAsignacionRow } from "./asignacion.types";

export function instrumentosRequeridos(catedras: IAsignacionRow[]): string[] {
  return Array.from(
    new Set(
      catedras
        .map((catedra) => catedra.instrumentoId)
        .filter((instrumentoId): instrumentoId is string => Boolean(instrumentoId))
    )
  );
}

export function docentesCompatibles(
  docentes: IAsignacionDocente[],
  requeridos: string[]
): IAsignacionDocente[] {
  if (requeridos.length === 0) return docentes;
  return docentes.filter((docente) =>
    requeridos.every((instrumentoId) => docente.instrumentoIds.includes(instrumentoId))
  );
}

export function opcionesDocentePara(
  catedra: IAsignacionRow,
  docentes: IAsignacionDocente[]
): IAsignacionDocente[] {
  const compatibles = docentesCompatibles(
    docentes,
    instrumentosRequeridos([catedra])
  );

  if (compatibles.some((docente) => docente.id === catedra.docenteId)) return compatibles;

  const actual = docentes.find((docente) => docente.id === catedra.docenteId);
  return actual ? [actual, ...compatibles] : compatibles;
}
