export interface IProgramaCursoClasificacion {
  instrumento: string | null;
  familia: string | null;
}

export function resolveProgramaInstrumento(cursos: IProgramaCursoClasificacion[]): string | null {
  const conInstrumento = cursos.filter((curso) => curso.instrumento !== null);
  if (!conInstrumento.length) return null;
  if (conInstrumento.length < cursos.length) return "Multidisciplinario";

  const instrumentos = new Set(cursos.map((curso) => curso.instrumento));
  if (instrumentos.size === 1) return cursos[0].instrumento;

  const familias = new Set(cursos.map((curso) => curso.familia));
  if (familias.size === 1 && cursos[0].familia !== null) return cursos[0].familia;

  return "Multidisciplinario";
}
