import { describe, expect, it } from "vitest"

import { sessionQueryKeys } from "@/entities/user"
import { siteConfigQueryKeys } from "@/entities/site-config/model/query-keys"
import { instrumentQueryKeys } from "@/entities/instrument/model/query-keys"
import { estudianteQueryKeys } from "@/entities/estudiante/model/query-keys"
import { matriculasQueryKeys } from "@/entities/matricula/model/query-keys"
import { usuariosQueryKeys } from "@/features/usuarios/model/query-keys"
import { instrumentosQueryKeys } from "@/features/instrumentos/model/query-keys"
import { cuotasQueryKeys } from "@/features/cuotas/model/query-keys"
import { testimoniosQueryKeys } from "@/features/testimonios/model/query-keys"
import { horariosQueryKeys } from "@/features/horarios/model/query-keys"
import { contactQueryKeys } from "@/features/contact/model/query-keys"
import { teacherQueryKeys } from "@/features/teacher-portal/model/query-keys"
import { galeriaQueryKeys } from "@/features/galeria/model/query-keys"
import { cobranzaQueryKeys } from "@/features/cobranza/model/query-keys"
import { evaluacionesQueryKeys } from "@/features/evaluaciones/model/query-keys"
import { studentQueryKeys } from "@/features/student-portal/model/query-keys"
import { certificadosQueryKeys } from "@/features/certificados/model/query-keys"
import { estudiantesQueryKeys } from "@/features/estudiantes/model/query-keys"
import { solicitudesQueryKeys } from "@/features/solicitudes/model/query-keys"
import { catedrasQueryKeys } from "@/features/catedras/model/query-keys"
import { docentesQueryKeys } from "@/features/docentes/model/query-keys"
import { acuerdosQueryKeys } from "@/features/acuerdos/model/query-keys"
import { topbarQueryKeys } from "@/features/dashboard-topbar/model/query-keys"
import { seccionesQueryKeys } from "@/features/secciones/model/query-keys"
import { resenasQueryKeys } from "@/features/resenas/model/query-keys"
import { cursosQueryKeys } from "@/features/cursos/model/query-keys"
import { materialesQueryKeys } from "@/features/materiales/model/query-keys"
import { representantesQueryKeys } from "@/features/representantes/model/query-keys"
import { pagosQueryKeys } from "@/features/pagos/model/query-keys"
import { metricasQueryKeys } from "@/features/metricas/model/query-keys"
import { programasQueryKeys } from "@/features/programas/model/query-keys"

const REGISTRY = {
  sessionQueryKeys,
  siteConfigQueryKeys,
  instrumentQueryKeys,
  estudianteQueryKeys,
  matriculasQueryKeys,
  usuariosQueryKeys,
  instrumentosQueryKeys,
  cuotasQueryKeys,
  testimoniosQueryKeys,
  horariosQueryKeys,
  contactQueryKeys,
  teacherQueryKeys,
  galeriaQueryKeys,
  cobranzaQueryKeys,
  evaluacionesQueryKeys,
  studentQueryKeys,
  certificadosQueryKeys,
  estudiantesQueryKeys,
  solicitudesQueryKeys,
  catedrasQueryKeys,
  docentesQueryKeys,
  acuerdosQueryKeys,
  topbarQueryKeys,
  seccionesQueryKeys,
  resenasQueryKeys,
  cursosQueryKeys,
  materialesQueryKeys,
  representantesQueryKeys,
  pagosQueryKeys,
  metricasQueryKeys,
  programasQueryKeys,
} as const

describe("query-keys", () => {
  it("cada feature tiene un root key único (sin colisiones)", () => {
    const roots = Object.entries(REGISTRY).map(([name, keys]) => ({ name, root: String(keys.all[0]) }))
    const duplicates = roots.filter(({ root }, index) => roots.findIndex((item) => item.root === root) !== index)

    expect(duplicates).toEqual([])
    expect(roots).toHaveLength(31)
  })

  it("los keys derivados cuelgan del root", () => {
    expect(estudiantesQueryKeys.list().slice(0, 1)).toEqual(["estudiantes"])
    expect(cursosQueryKeys.detail("c1").slice(0, 2)).toEqual(["cursos", "detail"])
    expect(topbarQueryKeys.search("ada").slice(0, 2)).toEqual(["topbar", "search"])
    expect(studentQueryKeys.all[0]).toBe("student-portal")
  })
})
