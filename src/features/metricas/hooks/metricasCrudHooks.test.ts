import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  crearMetrica: vi.fn(),
  actualizarMetrica: vi.fn(),
  eliminarMetrica: vi.fn(),
}))

vi.mock("../api/crearMetrica", () => ({ crearMetrica: api.crearMetrica }))
vi.mock("../api/actualizarMetrica", () => ({ actualizarMetrica: api.actualizarMetrica }))
vi.mock("../api/eliminarMetrica", () => ({ eliminarMetrica: api.eliminarMetrica }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useActualizarMetrica } from "./useActualizarMetrica"
import { useCrearMetrica } from "./useCrearMetrica"
import { useEliminarMetrica } from "./useEliminarMetrica"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

const VALUES = { etiqueta: "Estudiantes", valor: "120", sufijo: "+", icono: "ph:users-three", orden: 0, publicado: true }

describe("metricas CRUD hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.crearMetrica.mockResolvedValue({ data: { id: "m1" }, error: null })
    api.actualizarMetrica.mockResolvedValue({ data: { id: "m1" }, error: null })
    api.eliminarMetrica.mockResolvedValue({ error: null })
  })

  it("crea, actualiza y elimina métricas", async () => {
    const crear = renderHook(() => useCrearMetrica(), { wrapper: wrapper() })
    await act(async () => {
      await crear.result.current.mutateAsync(VALUES)
    })
    expect(api.crearMetrica).toHaveBeenCalledWith(VALUES)

    const actualizar = renderHook(() => useActualizarMetrica(), { wrapper: wrapper() })
    await act(async () => {
      await actualizar.result.current.mutateAsync({ id: "m1", values: { ...VALUES, valor: "130" } })
    })
    expect(api.actualizarMetrica).toHaveBeenCalledWith("m1", { ...VALUES, valor: "130" })

    const eliminar = renderHook(() => useEliminarMetrica(), { wrapper: wrapper() })
    await act(async () => {
      await eliminar.result.current.mutateAsync("m1")
    })
    expect(api.eliminarMetrica).toHaveBeenCalledWith("m1")
  })
})
