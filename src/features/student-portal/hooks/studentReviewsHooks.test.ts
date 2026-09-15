import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  editarResenaPropia: vi.fn(),
  retirarResenaPropia: vi.fn(),
}))

vi.mock("../api/editarResenaPropia", () => ({ editarResenaPropia: api.editarResenaPropia }))
vi.mock("../api/retirarResenaPropia", () => ({ retirarResenaPropia: api.retirarResenaPropia }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useEditarResenaPropia } from "./useEditarResenaPropia"
import { useRetirarResenaPropia } from "./useRetirarResenaPropia"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("student review edit/withdraw hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.editarResenaPropia.mockResolvedValue({ error: null })
    api.retirarResenaPropia.mockResolvedValue({ error: null })
  })

  it("edita y retira la reseña propia del estudiante", async () => {
    const editar = renderHook(() => useEditarResenaPropia("e1"), { wrapper: wrapper() })
    await act(async () => {
      await editar.result.current.mutateAsync({
        resenaId: "r1",
        values: { cursoId: "c1", puntuacion: 4, comentario: "Muy buena" },
      })
    })
    expect(api.editarResenaPropia).toHaveBeenCalledWith("r1", { cursoId: "c1", puntuacion: 4, comentario: "Muy buena" })

    const retirar = renderHook(() => useRetirarResenaPropia("e1"), { wrapper: wrapper() })
    await act(async () => {
      await retirar.result.current.mutateAsync("r1")
    })
    expect(api.retirarResenaPropia).toHaveBeenCalledWith("r1")
  })
})
