import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCuotas: vi.fn(),
  crearCuota: vi.fn(),
  updateCuota: vi.fn(),
  registrarPago: vi.fn(),
  reactivarCuota: vi.fn(),
  condonarCuota: vi.fn(),
  eliminarCuota: vi.fn(),
  generarCuotasMes: vi.fn(),
}))

vi.mock("../api/getCuotas", () => ({ getCuotas: api.getCuotas }))
vi.mock("../api/crearCuota", () => ({ crearCuota: api.crearCuota }))
vi.mock("../api/updateCuota", () => ({ updateCuota: api.updateCuota }))
vi.mock("../api/registrarPago", () => ({ registrarPago: api.registrarPago }))
vi.mock("../api/reactivarCuota", () => ({ reactivarCuota: api.reactivarCuota }))
vi.mock("../api/condonarCuota", () => ({ condonarCuota: api.condonarCuota }))
vi.mock("../api/eliminarCuota", () => ({ eliminarCuota: api.eliminarCuota }))
vi.mock("../api/generarCuotasMes", () => ({ generarCuotasMes: api.generarCuotasMes }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCondonarCuota } from "./useCondonarCuota"
import { useCrearCuota } from "./useCrearCuota"
import { useCuotas } from "./useCuotas"
import { useEliminarCuota } from "./useEliminarCuota"
import { useGenerarCuotasMes } from "./useGenerarCuotasMes"
import { useReactivarCuota } from "./useReactivarCuota"
import { useRegistrarPago } from "./useRegistrarPago"
import { useUpdateCuota } from "./useUpdateCuota"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("cuotas hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => useCuotas(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearCuota, api.crearCuota],
      [useUpdateCuota, api.updateCuota],
      [useRegistrarPago, api.registrarPago],
      [useReactivarCuota, api.reactivarCuota],
      [useCondonarCuota, api.condonarCuota],
      [useEliminarCuota, api.eliminarCuota],
      [useGenerarCuotasMes, api.generarCuotasMes],
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
})
