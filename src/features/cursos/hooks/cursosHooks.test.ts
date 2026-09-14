import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCursos: vi.fn(),
  getCursoById: vi.fn(),
  getCursoGuia: vi.fn(),
  getCursoHabilidades: vi.fn(),
  getCursoOptions: vi.fn(),
  crearCurso: vi.fn(),
  updateCurso: vi.fn(),
  eliminarCurso: vi.fn(),
  crearModulo: vi.fn(),
  updateModulo: vi.fn(),
  eliminarModulo: vi.fn(),
  crearLeccion: vi.fn(),
  updateLeccion: vi.fn(),
  eliminarLeccion: vi.fn(),
  crearHabilidad: vi.fn(),
  eliminarHabilidad: vi.fn(),
}))

vi.mock("../api/getCursos", () => ({ getCursos: api.getCursos }))
vi.mock("../api/getCursoById", () => ({ getCursoById: api.getCursoById }))
vi.mock("../api/getCursoGuia", () => ({ getCursoGuia: api.getCursoGuia }))
vi.mock("../api/getCursoHabilidades", () => ({
  getCursoHabilidades: api.getCursoHabilidades,
  crearHabilidad: api.crearHabilidad,
  eliminarHabilidad: api.eliminarHabilidad,
}))
vi.mock("../api/getCursoOptions", () => ({ getCursoOptions: api.getCursoOptions }))
vi.mock("../api/crearCurso", () => ({ crearCurso: api.crearCurso }))
vi.mock("../api/updateCurso", () => ({ updateCurso: api.updateCurso }))
vi.mock("../api/eliminarCurso", () => ({ eliminarCurso: api.eliminarCurso }))
vi.mock("../api/crearModulo", () => ({ crearModulo: api.crearModulo }))
vi.mock("../api/updateModulo", () => ({ updateModulo: api.updateModulo }))
vi.mock("../api/eliminarModulo", () => ({ eliminarModulo: api.eliminarModulo }))
vi.mock("../api/crearLeccion", () => ({ crearLeccion: api.crearLeccion }))
vi.mock("../api/updateLeccion", () => ({ updateLeccion: api.updateLeccion }))
vi.mock("../api/eliminarLeccion", () => ({ eliminarLeccion: api.eliminarLeccion }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }))
vi.mock("@/shared/api/persist-cloudinary-image", () => ({
  persistCloudinaryImage: async ({ persist }: { persist: (publicId: string | null) => Promise<{ data: unknown; error: string | null }> }) => ({
    ...(await persist(null)),
    cleanupError: null,
  }),
}))
vi.mock("@/shared/api/cloudinary-client", () => ({ deleteCloudinaryImage: vi.fn().mockResolvedValue({ error: null }) }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCrearCurso } from "./useCrearCurso"
import { useCrearHabilidad } from "./useCrearHabilidad"
import { useCrearLeccion } from "./useCrearLeccion"
import { useCrearModulo } from "./useCrearModulo"
import { useCurso } from "./useCurso"
import { useCursoGuia } from "./useCursoGuia"
import { useCursoHabilidades } from "./useCursoHabilidades"
import { useCursoOptions } from "./useCursoOptions"
import { useCursos } from "./useCursos"
import { useEliminarCurso } from "./useEliminarCurso"
import { useEliminarHabilidad } from "./useEliminarHabilidad"
import { useEliminarLeccion } from "./useEliminarLeccion"
import { useEliminarModulo } from "./useEliminarModulo"
import { useUpdateCurso } from "./useUpdateCurso"
import { useUpdateLeccion } from "./useUpdateLeccion"
import { useUpdateModulo } from "./useUpdateModulo"
import { getCrearCursoFormDefaults } from "../model/CrearCursoForm.config"

const OK = { data: [], error: null }

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("cursos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue(OK)
    api.eliminarCurso.mockResolvedValue({ data: { publicIds: [] }, error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useCursos(),
      () => useCurso("k1"),
      () => useCursoGuia("k1"),
      () => useCursoHabilidades("k1"),
      () => useCursoOptions(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const courseValues = { ...getCrearCursoFormDefaults(), nombre: "Curso", descripcion: "Descripción válida" }
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>, unknown]> = [
      [useCrearCurso, api.crearCurso, courseValues],
      [useUpdateCurso, api.updateCurso, { id: "k1", patch: { nombre: "Nuevo" } }],
      [useEliminarCurso, api.eliminarCurso, "k1"],
      [() => useCrearModulo("k1"), api.crearModulo, "x"],
      [() => useUpdateModulo("k1"), api.updateModulo, "x"],
      [() => useEliminarModulo("k1"), api.eliminarModulo, "x"],
      [() => useCrearLeccion("m1"), api.crearLeccion, "x"],
      [() => useUpdateLeccion("m1"), api.updateLeccion, "x"],
      [() => useEliminarLeccion("m1"), api.eliminarLeccion, "x"],
      [() => useCrearHabilidad("k1"), api.crearHabilidad, "x"],
      [() => useEliminarHabilidad("k1"), api.eliminarHabilidad, "x"],
    ]

    for (const [hook, expected, input] of cases) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await result.current.mutateAsync(input as never)
      })
      expect(expected).toHaveBeenCalled()
      unmount()
    }
  })

  it("expone error en queries fallidas", async () => {
    api.getCursos.mockResolvedValue({ data: null, error: "boom" })

    const { result } = renderHook(() => useCursos(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect((result.current.error as Error).message).toBe("boom")
  })

  it("propaga errores en mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const courseValues = { ...getCrearCursoFormDefaults(), nombre: "Curso", descripcion: "Descripción válida" }
    const mutations: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, unknown]> = [
      [useCrearCurso, courseValues],
      [useUpdateCurso, { id: "k1", patch: { nombre: "Nuevo" } }],
      [useEliminarCurso, "k1"],
      [() => useCrearModulo("k1"), "x"],
      [() => useUpdateModulo("k1"), "x"],
      [() => useEliminarModulo("k1"), "x"],
      [() => useCrearLeccion("m1"), "x"],
      [() => useUpdateLeccion("m1"), "x"],
      [() => useEliminarLeccion("m1"), "x"],
      [() => useCrearHabilidad("k1"), "x"],
      [() => useEliminarHabilidad("k1"), "x"],
    ]

    for (const [hook, input] of mutations) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await expect(result.current.mutateAsync(input as never)).rejects.toThrow("boom")
      })
      unmount()
    }
  })
})
