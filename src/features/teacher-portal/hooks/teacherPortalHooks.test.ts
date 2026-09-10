import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getTeacherDashboard: vi.fn(),
  getTeacherPerfil: vi.fn(),
  getTeacherCatedras: vi.fn(),
  getTeacherEstudiantes: vi.fn(),
  getTeacherEvaluaciones: vi.fn(),
  getTeacherMateriales: vi.fn(),
  getTeacherCatalogos: vi.fn(),
  getTeacherSesiones: vi.fn(),
  getTeacherSesionAsistencia: vi.fn(),
  getTeacherCalificaciones: vi.fn(),
  getEstudianteAsistencias: vi.fn(),
  getCursoTemario: vi.fn(),
  createTeacherEvaluacion: vi.fn(),
  createTeacherFormacion: vi.fn(),
  createTeacherMaterial: vi.fn(),
  createTeacherPortafolio: vi.fn(),
  createTeacherReconocimiento: vi.fn(),
  createTeacherSesion: vi.fn(),
  deleteTeacherFormacion: vi.fn(),
  deleteTeacherMaterial: vi.fn(),
  deleteTeacherPortafolio: vi.fn(),
  deleteTeacherReconocimiento: vi.fn(),
  guardarTeacherAsistencias: vi.fn(),
  guardarTeacherCalificaciones: vi.fn(),
  updateTeacherPerfil: vi.fn(),
  updateTeacherInstrumentos: vi.fn(),
  updateTeacherSesionEstado: vi.fn(),
}))

vi.mock("../api/getTeacherDashboard", () => ({ getTeacherDashboard: api.getTeacherDashboard }))
vi.mock("../api/getTeacherPerfil", () => ({ getTeacherPerfil: api.getTeacherPerfil }))
vi.mock("../api/getTeacherCatedras", () => ({ getTeacherCatedras: api.getTeacherCatedras }))
vi.mock("../api/getTeacherEstudiantes", () => ({ getTeacherEstudiantes: api.getTeacherEstudiantes }))
vi.mock("../api/getTeacherEvaluaciones", () => ({ getTeacherEvaluaciones: api.getTeacherEvaluaciones }))
vi.mock("../api/getTeacherMateriales", () => ({ getTeacherMateriales: api.getTeacherMateriales }))
vi.mock("../api/getTeacherCatalogos", () => ({ getTeacherCatalogos: api.getTeacherCatalogos }))
vi.mock("../api/getTeacherSesiones", () => ({ getTeacherSesiones: api.getTeacherSesiones }))
vi.mock("../api/getTeacherSesionAsistencia", () => ({ getTeacherSesionAsistencia: api.getTeacherSesionAsistencia }))
vi.mock("../api/getTeacherCalificaciones", () => ({ getTeacherCalificaciones: api.getTeacherCalificaciones }))
vi.mock("../api/getEstudianteAsistencias", () => ({ getEstudianteAsistencias: api.getEstudianteAsistencias }))
vi.mock("../api/getCursoTemario", () => ({ getCursoTemario: api.getCursoTemario }))
vi.mock("../api/createTeacherEvaluacion", () => ({ createTeacherEvaluacion: api.createTeacherEvaluacion }))
vi.mock("../api/createTeacherFormacion", () => ({ createTeacherFormacion: api.createTeacherFormacion }))
vi.mock("../api/createTeacherMaterial", () => ({ createTeacherMaterial: api.createTeacherMaterial }))
vi.mock("../api/createTeacherPortafolio", () => ({ createTeacherPortafolio: api.createTeacherPortafolio }))
vi.mock("../api/createTeacherReconocimiento", () => ({ createTeacherReconocimiento: api.createTeacherReconocimiento }))
vi.mock("../api/createTeacherSesion", () => ({ createTeacherSesion: api.createTeacherSesion }))
vi.mock("../api/deleteTeacherFormacion", () => ({ deleteTeacherFormacion: api.deleteTeacherFormacion }))
vi.mock("../api/deleteTeacherMaterial", () => ({ deleteTeacherMaterial: api.deleteTeacherMaterial }))
vi.mock("../api/deleteTeacherPortafolio", () => ({ deleteTeacherPortafolio: api.deleteTeacherPortafolio }))
vi.mock("../api/deleteTeacherReconocimiento", () => ({ deleteTeacherReconocimiento: api.deleteTeacherReconocimiento }))
vi.mock("../api/guardarTeacherAsistencias", () => ({ guardarTeacherAsistencias: api.guardarTeacherAsistencias }))
vi.mock("../api/guardarTeacherCalificaciones", () => ({ guardarTeacherCalificaciones: api.guardarTeacherCalificaciones }))
vi.mock("../api/updateTeacherPerfil", () => ({ updateTeacherPerfil: api.updateTeacherPerfil }))
vi.mock("../api/updateTeacherInstrumentos", () => ({ updateTeacherInstrumentos: api.updateTeacherInstrumentos }))
vi.mock("../api/updateTeacherSesionEstado", () => ({ updateTeacherSesionEstado: api.updateTeacherSesionEstado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCreateTeacherEvaluacion } from "./useCreateTeacherEvaluacion"
import { useCreateTeacherFormacion } from "./useCreateTeacherFormacion"
import { useCreateTeacherMaterial } from "./useCreateTeacherMaterial"
import { useCreateTeacherPortafolio } from "./useCreateTeacherPortafolio"
import { useCreateTeacherReconocimiento } from "./useCreateTeacherReconocimiento"
import { useCreateTeacherSesion } from "./useCreateTeacherSesion"
import { useCursoTemario } from "./useCursoTemario"
import { useDeleteTeacherFormacion } from "./useDeleteTeacherFormacion"
import { useDeleteTeacherMaterial } from "./useDeleteTeacherMaterial"
import { useDeleteTeacherPortafolio } from "./useDeleteTeacherPortafolio"
import { useDeleteTeacherReconocimiento } from "./useDeleteTeacherReconocimiento"
import { useEstudianteAsistencias } from "./useEstudianteAsistencias"
import { useGuardarTeacherAsistencias } from "./useGuardarTeacherAsistencias"
import { useGuardarTeacherCalificaciones } from "./useGuardarTeacherCalificaciones"
import { useTeacherCalificaciones } from "./useTeacherCalificaciones"
import { useTeacherCatalogos } from "./useTeacherCatalogos"
import { useTeacherCatedras } from "./useTeacherCatedras"
import { useTeacherDashboard } from "./useTeacherDashboard"
import { useTeacherEstudiantes } from "./useTeacherEstudiantes"
import { useTeacherEvaluaciones } from "./useTeacherEvaluaciones"
import { useTeacherMateriales } from "./useTeacherMateriales"
import { useTeacherPerfil } from "./useTeacherPerfil"
import { useTeacherSesionAsistencia } from "./useTeacherSesionAsistencia"
import { useTeacherSesiones } from "./useTeacherSesiones"
import { useUpdateTeacherInstrumentos } from "./useUpdateTeacherInstrumentos"
import { useUpdateTeacherPerfil } from "./useUpdateTeacherPerfil"
import { useUpdateTeacherSesionEstado } from "./useUpdateTeacherSesionEstado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("teacher-portal hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useTeacherDashboard(),
      () => useTeacherPerfil(),
      () => useTeacherCatedras(),
      () => useTeacherEstudiantes(),
      () => useTeacherEvaluaciones(),
      () => useTeacherMateriales(),
      () => useTeacherCatalogos(),
      () => useTeacherSesiones(),
      () => useTeacherSesionAsistencia("s1"),
      () => useTeacherCalificaciones("ev1"),
      () => useEstudianteAsistencias("i1"),
      () => useCursoTemario("k1"),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCreateTeacherEvaluacion, api.createTeacherEvaluacion],
      [useCreateTeacherFormacion, api.createTeacherFormacion],
      [useCreateTeacherMaterial, api.createTeacherMaterial],
      [useCreateTeacherPortafolio, api.createTeacherPortafolio],
      [useCreateTeacherReconocimiento, api.createTeacherReconocimiento],
      [useCreateTeacherSesion, api.createTeacherSesion],
      [useDeleteTeacherFormacion, api.deleteTeacherFormacion],
      [useDeleteTeacherMaterial, api.deleteTeacherMaterial],
      [useDeleteTeacherPortafolio, api.deleteTeacherPortafolio],
      [useDeleteTeacherReconocimiento, api.deleteTeacherReconocimiento],
      [useGuardarTeacherAsistencias, api.guardarTeacherAsistencias],
      [useGuardarTeacherCalificaciones, api.guardarTeacherCalificaciones],
      [useUpdateTeacherPerfil, api.updateTeacherPerfil],
      [useUpdateTeacherInstrumentos, api.updateTeacherInstrumentos],
      [useUpdateTeacherSesionEstado, api.updateTeacherSesionEstado],
    ]

    for (const [hook, expected] of cases) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await result.current.mutateAsync("x" as never)
      })
      expect(expected).toHaveBeenCalled()
      unmount()
    }
  })

  it("propaga errores de queries y mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const query = renderHook(() => useTeacherDashboard(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCreateTeacherEvaluacion,
      useCreateTeacherFormacion,
      useCreateTeacherMaterial,
      useCreateTeacherPortafolio,
      useCreateTeacherReconocimiento,
      useCreateTeacherSesion,
      useDeleteTeacherFormacion,
      useDeleteTeacherMaterial,
      useDeleteTeacherPortafolio,
      useDeleteTeacherReconocimiento,
      useGuardarTeacherAsistencias,
      useGuardarTeacherCalificaciones,
      useUpdateTeacherPerfil,
      useUpdateTeacherInstrumentos,
      useUpdateTeacherSesionEstado,
    ]

    for (const hook of mutations) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await expect(result.current.mutateAsync("x" as never)).rejects.toThrow("boom")
      })
      unmount()
    }
  })
})
