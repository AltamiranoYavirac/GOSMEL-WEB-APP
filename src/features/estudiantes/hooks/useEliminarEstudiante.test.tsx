import { QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { eliminarEstudianteMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  eliminarEstudianteMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock("../api/eliminarEstudiante", () => ({ eliminarEstudiante: eliminarEstudianteMock }))
vi.mock("sonner", () => ({ toast: { success: toastSuccessMock, error: toastErrorMock } }))

import { createTestQueryClient } from "@/test/query"

import { estudiantesQueryKeys } from "../model/query-keys"
import { useEliminarEstudiante } from "./useEliminarEstudiante"

function buildWrapper(client: ReturnType<typeof createTestQueryClient>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe("useEliminarEstudiante", () => {
  beforeEach(() => {
    eliminarEstudianteMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it("invalida estudiantes, usuarios y cobranza y avisa eliminación", async () => {
    eliminarEstudianteMock.mockResolvedValue({ data: { deleted: true }, error: null })
    const client = createTestQueryClient()
    const invalidateSpy = vi.spyOn(client, "invalidateQueries")

    const { result } = renderHook(() => useEliminarEstudiante(), { wrapper: buildWrapper(client) })

    await act(async () => {
      await result.current.mutateAsync({ id: "e1", perfilId: "p1" })
    })

    expect(eliminarEstudianteMock).toHaveBeenCalledWith("e1", "p1")
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: estudiantesQueryKeys.list() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["usuarios", "list"] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cobranza", "list"] })
    expect(toastSuccessMock).toHaveBeenCalledWith("Estudiante eliminado")
  })

  it("avisa desactivación cuando no se borró", async () => {
    eliminarEstudianteMock.mockResolvedValue({ data: { deleted: false }, error: null })
    const client = createTestQueryClient()

    const { result } = renderHook(() => useEliminarEstudiante(), { wrapper: buildWrapper(client) })

    await act(async () => {
      await result.current.mutateAsync({ id: "e1", perfilId: null })
    })

    expect(toastSuccessMock).toHaveBeenCalledWith("Estudiante desactivado (conserva su historial)")
  })

  it("muestra el error de la api", async () => {
    eliminarEstudianteMock.mockResolvedValue({ data: null, error: "no se puede" })
    const client = createTestQueryClient()

    const { result } = renderHook(() => useEliminarEstudiante(), { wrapper: buildWrapper(client) })

    await act(async () => {
      await expect(result.current.mutateAsync({ id: "e1", perfilId: null })).rejects.toThrow("no se puede")
    })

    expect(toastErrorMock).toHaveBeenCalledWith("no se puede")
  })
})
