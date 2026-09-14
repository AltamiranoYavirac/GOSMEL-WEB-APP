import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getProgramas: vi.fn(),
  getProgramaDetalle: vi.fn(),
  getProgramaOptions: vi.fn(),
  crearPrograma: vi.fn(),
  updatePrograma: vi.fn(),
  eliminarPrograma: vi.fn(),
  updateProgramaPublicado: vi.fn(),
  asociarCursoPrograma: vi.fn(),
  desasociarCursoPrograma: vi.fn(),
  updateOrdenCursoPrograma: vi.fn(),
  agregarObjetivoPrograma: vi.fn(),
  eliminarObjetivoPrograma: vi.fn(),
  updateOrdenObjetivoPrograma: vi.fn(),
}))

vi.mock("../api/getProgramas", () => ({ getProgramas: api.getProgramas }))
vi.mock("../api/getProgramaDetalle", () => ({
  getProgramaDetalle: api.getProgramaDetalle,
  asociarCursoPrograma: api.asociarCursoPrograma,
  desasociarCursoPrograma: api.desasociarCursoPrograma,
  updateOrdenCursoPrograma: api.updateOrdenCursoPrograma,
}))
vi.mock("../api/getProgramaOptions", () => ({ getProgramaOptions: api.getProgramaOptions }))
vi.mock("../api/crearPrograma", () => ({ crearPrograma: api.crearPrograma }))
vi.mock("../api/updatePrograma", () => ({ updatePrograma: api.updatePrograma }))
vi.mock("../api/eliminarPrograma", () => ({ eliminarPrograma: api.eliminarPrograma }))
vi.mock("../api/updateProgramaPublicado", () => ({ updateProgramaPublicado: api.updateProgramaPublicado }))
vi.mock("../api/programaObjetivos", () => ({
  agregarObjetivoPrograma: api.agregarObjetivoPrograma,
  eliminarObjetivoPrograma: api.eliminarObjetivoPrograma,
  updateOrdenObjetivoPrograma: api.updateOrdenObjetivoPrograma,
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }))
vi.mock("@/shared/api/persist-cloudinary-image", () => ({
  persistCloudinaryImage: async ({ persist }: { persist: (publicId: string | null) => Promise<{ data: unknown; error: string | null }> }) => ({
    ...(await persist(null)),
    cleanupError: null,
  }),
}))
vi.mock("@/shared/api/cloudinary-client", () => ({ deleteCloudinaryImage: vi.fn().mockResolvedValue({ error: null }) }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsociarCursoPrograma } from "./useAsociarCursoPrograma"
import { useCrearPrograma } from "./useCrearPrograma"
import { useDesasociarCursoPrograma } from "./useDesasociarCursoPrograma"
import { useEliminarPrograma } from "./useEliminarPrograma"
import { useMoverCursoPrograma } from "./useMoverCursoPrograma"
import { useAgregarObjetivoPrograma, useEliminarObjetivoPrograma, useMoverObjetivoPrograma } from "./useObjetivosPrograma"
import { useProgramaDetalle } from "./useProgramaDetalle"
import { useProgramaOptions } from "./useProgramaOptions"
import { useProgramas } from "./useProgramas"
import { useUpdatePrograma } from "./useUpdatePrograma"
import { useUpdateProgramaPublicado } from "./useUpdateProgramaPublicado"
import { getProgramaFormDefaults } from "../model/ProgramaForm.config"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("programas hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
    api.eliminarPrograma.mockResolvedValue({ data: { publicId: null }, error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useProgramas(),
      () => useProgramaDetalle("pg1"),
      () => useProgramaOptions(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const values = { ...getProgramaFormDefaults(), nombre: "Programa" }
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>, unknown]> = [
      [useCrearPrograma, api.crearPrograma, values],
      [useUpdatePrograma, api.updatePrograma, { programaId: "pg1", values }],
      [useEliminarPrograma, api.eliminarPrograma, "pg1"],
      [useUpdateProgramaPublicado, api.updateProgramaPublicado, "x"],
      [() => useAsociarCursoPrograma("pg1"), api.asociarCursoPrograma, "x"],
      [() => useDesasociarCursoPrograma("pg1"), api.desasociarCursoPrograma, "x"],
      [
        () => useMoverCursoPrograma("pg1"),
        api.updateOrdenCursoPrograma,
        { origen: { cursoId: "k1", orden: 0 }, destino: { cursoId: "k2", orden: 1 } },
      ],
      [() => useAgregarObjetivoPrograma("pg1"), api.agregarObjetivoPrograma, { objetivo: "Nuevo", orden: 0 }],
      [() => useEliminarObjetivoPrograma("pg1"), api.eliminarObjetivoPrograma, "o1"],
      [
        () => useMoverObjetivoPrograma("pg1"),
        api.updateOrdenObjetivoPrograma,
        { origen: { id: "o1", orden: 0 }, destino: { id: "o2", orden: 1 } },
      ],
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

  it("propaga errores en queries y mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const query = renderHook(() => useProgramas(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const values = { ...getProgramaFormDefaults(), nombre: "Programa" }
    const mutations: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, unknown]> = [
      [useCrearPrograma, values],
      [useUpdatePrograma, { programaId: "pg1", values }],
      [useEliminarPrograma, "pg1"],
      [useUpdateProgramaPublicado, "x"],
      [() => useAsociarCursoPrograma("pg1"), "x"],
      [() => useDesasociarCursoPrograma("pg1"), "x"],
      [() => useMoverCursoPrograma("pg1"), { origen: { cursoId: "k1", orden: 0 }, destino: { cursoId: "k2", orden: 1 } }],
      [() => useAgregarObjetivoPrograma("pg1"), { objetivo: "Nuevo", orden: 0 }],
      [() => useEliminarObjetivoPrograma("pg1"), "o1"],
      [() => useMoverObjetivoPrograma("pg1"), { origen: { id: "o1", orden: 0 }, destino: { id: "o2", orden: 1 } }],
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
