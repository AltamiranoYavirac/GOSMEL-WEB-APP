import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSesiones: vi.fn(),
  getHorariosRecurrentes: vi.fn(),
  getCatedrasParaHorarios: vi.fn(),
  getAsistenciasSesion: vi.fn(),
  crearSesion: vi.fn(),
  crearHorarioRecurrente: vi.fn(),
  eliminarHorarioRecurrente: vi.fn(),
  guardarAsistenciasSesion: vi.fn(),
  updateSesionEstado: vi.fn(),
}))

vi.mock("../api/getSesiones", () => ({ getSesiones: api.getSesiones }))
vi.mock("../api/getHorariosRecurrentes", () => ({ getHorariosRecurrentes: api.getHorariosRecurrentes }))
vi.mock("../api/getCatedrasParaHorarios", () => ({ getCatedrasParaHorarios: api.getCatedrasParaHorarios }))
vi.mock("../api/getAsistenciasSesion", () => ({ getAsistenciasSesion: api.getAsistenciasSesion }))
vi.mock("../api/crearSesion", () => ({ crearSesion: api.crearSesion }))
vi.mock("../api/crearHorarioRecurrente", () => ({ crearHorarioRecurrente: api.crearHorarioRecurrente }))
vi.mock("../api/eliminarHorarioRecurrente", () => ({ eliminarHorarioRecurrente: api.eliminarHorarioRecurrente }))
vi.mock("../api/guardarAsistenciasSesion", () => ({ guardarAsistenciasSesion: api.guardarAsistenciasSesion }))
vi.mock("../api/updateSesionEstado", () => ({ updateSesionEstado: api.updateSesionEstado }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsistenciasSesion } from "./useAsistenciasSesion"
import { useCatedrasParaHorarios } from "./useCatedrasParaHorarios"
import { useCrearHorarioRecurrente } from "./useCrearHorarioRecurrente"
import { useCrearSesion } from "./useCrearSesion"
import { useEliminarHorarioRecurrente } from "./useEliminarHorarioRecurrente"
import { useGuardarAsistenciasSesion } from "./useGuardarAsistenciasSesion"
import { useHorariosRecurrentes } from "./useHorariosRecurrentes"
import { useSesiones } from "./useSesiones"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("horarios hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useSesiones(),
      () => useHorariosRecurrentes(),
      () => useCatedrasParaHorarios(),
      () => useAsistenciasSesion("s1"),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearSesion, api.crearSesion],
      [useCrearHorarioRecurrente, api.crearHorarioRecurrente],
      [useEliminarHorarioRecurrente, api.eliminarHorarioRecurrente],
      [() => useGuardarAsistenciasSesion("s1"), api.guardarAsistenciasSesion],
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

  it("propaga errores en queries y mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const query = renderHook(() => useSesiones(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearSesion,
      useCrearHorarioRecurrente,
      useEliminarHorarioRecurrente,
      () => useGuardarAsistenciasSesion("s1"),
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
