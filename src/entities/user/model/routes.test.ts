import { describe, expect, it } from "vitest"

import { isDashboardRouteAllowed, resolvePostLoginRoute } from "./routes"

describe("isDashboardRouteAllowed", () => {
  it("rechaza rutas fuera de /dashboard", () => {
    expect(isDashboardRouteAllowed("/", ["admin"])).toBe(false)
    expect(isDashboardRouteAllowed("/cursos", ["admin"])).toBe(false)
  })

  it("permite la raíz del dashboard si hay al menos un rol", () => {
    expect(isDashboardRouteAllowed("/dashboard", ["estudiante"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/", ["estudiante"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard", [])).toBe(false)
  })

  it("/dashboard/admin solo para admin", () => {
    expect(isDashboardRouteAllowed("/dashboard/admin", ["admin"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/admin/usuarios", ["admin"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/admin", ["docente"])).toBe(false)
    expect(isDashboardRouteAllowed("/dashboard/admin", ["estudiante"])).toBe(false)
  })

  it("/dashboard/teacher para admin y docente", () => {
    expect(isDashboardRouteAllowed("/dashboard/teacher", ["docente"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/teacher", ["admin"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/teacher/catedras", ["admin"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/teacher", ["estudiante"])).toBe(false)
  })

  it("/dashboard/student para quien no sea admin ni docente", () => {
    expect(isDashboardRouteAllowed("/dashboard/student", ["estudiante"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/student", ["representante"])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/student", [])).toBe(true)
    expect(isDashboardRouteAllowed("/dashboard/student", ["admin"])).toBe(false)
    expect(isDashboardRouteAllowed("/dashboard/student", ["docente"])).toBe(false)
  })

  it("rechaza subrutas desconocidas bajo /dashboard", () => {
    expect(isDashboardRouteAllowed("/dashboard/desconocido", ["admin"])).toBe(false)
  })
})

describe("resolvePostLoginRoute", () => {
  it("sin next usa la home del rol", () => {
    expect(resolvePostLoginRoute(null, ["docente"])).toBe("/dashboard/teacher")
    expect(resolvePostLoginRoute(undefined, ["estudiante"])).toBe("/dashboard/student")
  })

  it("bloquea open redirects", () => {
    const roles = ["admin"] as const
    expect(resolvePostLoginRoute("https://evil.com", [...roles])).toBe("/dashboard/admin")
    expect(resolvePostLoginRoute("//evil", [...roles])).toBe("/dashboard/admin")
    expect(resolvePostLoginRoute("/dashboard/../x", [...roles])).toBe("/dashboard/admin")
    expect(resolvePostLoginRoute("/dashboard\\admin", [...roles])).toBe("/dashboard/admin")
  })

  it("bloquea rutas de dashboard sin permiso", () => {
    expect(resolvePostLoginRoute("/dashboard/admin", ["estudiante"])).toBe("/dashboard/student")
    expect(resolvePostLoginRoute("/dashboard/student", ["admin"])).toBe("/dashboard/admin")
  })

  it("rechaza /dashboard y /dashboard/ como destino", () => {
    expect(resolvePostLoginRoute("/dashboard", ["admin"])).toBe("/dashboard/admin")
    expect(resolvePostLoginRoute("/dashboard/", ["admin"])).toBe("/dashboard/admin")
  })

  it("conserva una ruta permitida con query", () => {
    expect(resolvePostLoginRoute("/dashboard/admin/usuarios?page=2", ["admin"])).toBe(
      "/dashboard/admin/usuarios?page=2",
    )
  })
})
