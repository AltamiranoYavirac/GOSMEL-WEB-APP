import { QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { createEstudianteMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  createEstudianteMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock("../api/createEstudiante", () => ({ createEstudiante: createEstudianteMock }))
vi.mock("sonner", () => ({ toast: { success: toastSuccessMock, error: toastErrorMock } }))

import { createTestQueryClient } from "@/test/query"

import { estudiantesQueryKeys } from "../model/query-keys"
import { useCreateEstudiante } from "./useCreateEstudiante"

const INPUT = {
  nombres: "Ada",
  apellidos: "Lovelace",
  fecha_nacimiento: "2015-06-15",
  nivel_musical: "iniciacion" as const,
}

describe("useCreateEstudiante", () => {
  beforeEach(() => {
    createEstudianteMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it("invalida el listado y muestra toast al crear", async () => {
    createEstudianteMock.mockResolvedValue({ data: { id: "e1" }, error: null })
    const client = createTestQueryClient()
    const invalidateSpy = vi.spyOn(client, "invalidateQueries")

    const { result } = renderHook(() => useCreateEstudiante(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    })

    await act(async () => {
      await result.current.mutateAsync(INPUT)
    })

    expect(createEstudianteMock).toHaveBeenCalledWith(INPUT)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: estudiantesQueryKeys.list() })
    expect(toastSuccessMock).toHaveBeenCalledWith("Estudiante registrado correctamente")
  })

  it("muestra toast de error cuando la api falla", async () => {
    createEstudianteMock.mockResolvedValue({ data: null, error: "boom" })
    const client = createTestQueryClient()

    const { result } = renderHook(() => useCreateEstudiante(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    })

    await act(async () => {
      await expect(result.current.mutateAsync(INPUT)).rejects.toThrow("boom")
    })

    expect(toastErrorMock).toHaveBeenCalledWith("Error al registrar estudiante: boom")
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })
})
