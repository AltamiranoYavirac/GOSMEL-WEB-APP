import { describe, expect, it } from "vitest"

import { ROLE_HOME_ROUTE, ROLE_LABEL, resolveHomeRoute, resolvePrimaryRole, resolveProfileRoute } from "./roles"

describe("resolveHomeRoute", () => {
  it("cae a /dashboard/student con roles vacíos", () => {
    expect(resolveHomeRoute([])).toBe("/dashboard/student")
  })

  it("resuelve la ruta de cada rol", () => {
    expect(resolveHomeRoute(["estudiante"])).toBe("/dashboard/student")
    expect(resolveHomeRoute(["representante"])).toBe("/dashboard/student")
    expect(resolveHomeRoute(["docente"])).toBe("/dashboard/teacher")
    expect(resolveHomeRoute(["admin"])).toBe("/dashboard/admin")
  })

  it("respeta la precedencia admin > docente > estudiante > representante", () => {
    expect(resolveHomeRoute(["docente", "admin"])).toBe("/dashboard/admin")
    expect(resolveHomeRoute(["estudiante", "docente"])).toBe("/dashboard/teacher")
    expect(resolveHomeRoute(["representante", "estudiante"])).toBe("/dashboard/student")
  })
})

describe("resolvePrimaryRole", () => {
  it("cae a estudiante con roles vacíos", () => {
    expect(resolvePrimaryRole([])).toBe("estudiante")
  })

  it("respeta la precedencia de roles", () => {
    expect(resolvePrimaryRole(["docente", "admin"])).toBe("admin")
    expect(resolvePrimaryRole(["estudiante", "docente"])).toBe("docente")
    expect(resolvePrimaryRole(["representante"])).toBe("representante")
  })
})

describe("resolveProfileRoute", () => {
  it("devuelve la ruta de perfil de admin y docente", () => {
    expect(resolveProfileRoute(["admin"])).toBe("/dashboard/admin/configuracion")
    expect(resolveProfileRoute(["docente"])).toBe("/dashboard/teacher/perfil")
  })

  it("devuelve null para roles sin página de perfil", () => {
    expect(resolveProfileRoute(["estudiante"])).toBeNull()
    expect(resolveProfileRoute(["representante"])).toBeNull()
    expect(resolveProfileRoute([])).toBeNull()
  })

  it("respeta la precedencia de roles", () => {
    expect(resolveProfileRoute(["docente", "admin"])).toBe("/dashboard/admin/configuracion")
    expect(resolveProfileRoute(["estudiante", "docente"])).toBe("/dashboard/teacher/perfil")
  })
})

describe("mapas de rol", () => {
  it("todo rol tiene ruta y label", () => {
    const roles = ["admin", "docente", "estudiante", "representante"] as const
    for (const rol of roles) {
      expect(ROLE_HOME_ROUTE[rol]).toMatch(/^\/dashboard\//)
      expect(ROLE_LABEL[rol]).toBeTruthy()
    }
  })
})
