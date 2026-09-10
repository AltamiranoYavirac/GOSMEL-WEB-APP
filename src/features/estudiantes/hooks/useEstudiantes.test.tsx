import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { getEstudiantesMock } = vi.hoisted(() => ({ getEstudiantesMock: vi.fn() }))

vi.mock("../api/getEstudiantes", () => ({ getEstudiantes: getEstudiantesMock }))

import { createTestQueryClient } from "@/test/query"

import { estudiantesQueryKeys } from "../model/query-keys"
import { useEstudiantes } from "./useEstudiantes"

function buildWrapper(client: ReturnType<typeof createTestQueryClient>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe("useEstudiantes", () => {
  beforeEach(() => {
    getEstudiantesMock.mockReset()
  })

  it("mapea los datos y usa la query key del listado", async () => {
    const rows = [{ id: "e1", nombreCompleto: "Ada Lovelace" }]
    getEstudiantesMock.mockResolvedValue({ data: rows, error: null })
    const client = createTestQueryClient()

    const { result } = renderHook(() => useEstudiantes(), { wrapper: buildWrapper(client) })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(rows)
    expect(client.getQueryData(estudiantesQueryKeys.list())).toEqual(rows)
  })

  it("expone el error como excepción de la query", async () => {
    getEstudiantesMock.mockResolvedValue({ data: null, error: "boom" })
    const client = createTestQueryClient()

    const { result } = renderHook(() => useEstudiantes(), { wrapper: buildWrapper(client) })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect((result.current.error as Error).message).toBe("boom")
  })
})
