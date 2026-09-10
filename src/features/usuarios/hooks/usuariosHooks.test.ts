import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getUsuarios: vi.fn(),
  updateUsuarioContacto: vi.fn(),
  updateUsuarioActivo: vi.fn(),
  quitarRol: vi.fn(),
  asignarRolDocente: vi.fn(),
  asignarEstudiante: vi.fn(),
}))

vi.mock("../api/getUsuarios", () => ({ getUsuarios: api.getUsuarios }))
vi.mock("../api/updateUsuarioContacto", () => ({ updateUsuarioContacto: api.updateUsuarioContacto }))
vi.mock("../api/updateUsuarioActivo", () => ({ updateUsuarioActivo: api.updateUsuarioActivo }))
vi.mock("../api/quitarRol", () => ({ quitarRol: api.quitarRol }))
vi.mock("../api/asignarRolDocente", () => ({ asignarRolDocente: api.asignarRolDocente }))
vi.mock("../api/asignarEstudiante", () => ({ asignarEstudiante: api.asignarEstudiante }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsignarEstudiante } from "./useAsignarEstudiante"
import { useAsignarRolDocente } from "./useAsignarRolDocente"
import { useQuitarRol } from "./useQuitarRol"
import { useUpdateUsuarioActivo } from "./useUpdateUsuarioActivo"
import { useUpdateUsuarioContacto } from "./useUpdateUsuarioContacto"
import { useUsuarios } from "./useUsuarios"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("usuarios hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => useUsuarios(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useUpdateUsuarioContacto, api.updateUsuarioContacto],
      [useUpdateUsuarioActivo, api.updateUsuarioActivo],
      [useQuitarRol, api.quitarRol],
      [useAsignarRolDocente, api.asignarRolDocente],
      [useAsignarEstudiante, api.asignarEstudiante],
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
