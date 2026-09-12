import { describe, expect, it } from "vitest"

import { DASHBOARD_NAV, DASHBOARD_NAV_FOOTER, getDashboardSectionGroup, getDashboardSectionLabel } from "./dashboard-nav"

const ADMIN = DASHBOARD_NAV.admin
const STUDENT = DASHBOARD_NAV.estudiante

describe("getDashboardSectionLabel", () => {
  it("hace match exacto", () => {
    expect(getDashboardSectionLabel("/dashboard/admin", ADMIN)).toBe("Panel general")
    expect(getDashboardSectionLabel("/dashboard/admin/cuotas", ADMIN)).toBe("Cuotas")
  })

  it("hace match por prefijo", () => {
    expect(getDashboardSectionLabel("/dashboard/admin/cuotas/123", ADMIN)).toBe("Cuotas")
    expect(getDashboardSectionLabel("/dashboard/admin/usuarios/u1", ADMIN)).toBe("Usuarios y roles")
  })

  it("devuelve vacío solo fuera del prefijo de la sección", () => {
    expect(getDashboardSectionLabel("/otra/ruta", ADMIN)).toBe("")
  })

  it("una subruta desconocida cae al match de prefijo más largo", () => {
    expect(getDashboardSectionLabel("/dashboard/admin/desconocido", ADMIN)).toBe("Panel general")
  })

  it("funciona con el nav de estudiante", () => {
    expect(getDashboardSectionLabel("/dashboard/student/notas", STUDENT)).toBe("Notas y asistencia")
  })

  it("resuelve items del footer de navegación", () => {
    expect(getDashboardSectionLabel("/dashboard/perfil", ADMIN, DASHBOARD_NAV_FOOTER.admin)).toBe("Mi cuenta")
    expect(getDashboardSectionLabel("/dashboard/perfil", STUDENT, DASHBOARD_NAV_FOOTER.estudiante)).toBe("Mi cuenta")
    expect(getDashboardSectionLabel("/dashboard/perfil", STUDENT)).toBe("")
  })
})

describe("getDashboardSectionGroup", () => {
  it("devuelve el grupo que contiene la ruta", () => {
    expect(getDashboardSectionGroup("/dashboard/admin/cuotas", ADMIN)).toBe("Cobranza y pagos")
    expect(getDashboardSectionGroup("/dashboard/admin/estudiantes/123", ADMIN)).toBe("Personas")
    expect(getDashboardSectionGroup("/dashboard/admin/cursos", ADMIN)).toBe("Academia")
  })

  it("el grupo con href propio se resuelve a sí mismo", () => {
    expect(getDashboardSectionGroup("/dashboard/admin", ADMIN)).toBe("Panel general")
  })

  it("devuelve vacío para un pathname desconocido", () => {
    expect(getDashboardSectionGroup("/otra/ruta", ADMIN)).toBe("")
  })

  it("una subruta desconocida cae al grupo del match de prefijo", () => {
    expect(getDashboardSectionGroup("/dashboard/admin/desconocido", ADMIN)).toBe("Panel general")
  })
})
