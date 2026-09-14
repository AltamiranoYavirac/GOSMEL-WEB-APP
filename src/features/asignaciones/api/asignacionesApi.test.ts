import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { getAsignaciones } from "./getAsignaciones"
import { reasignarCatedras } from "./reasignarCatedras"

describe("asignaciones API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getAsignaciones mapea cátedras, docentes y conteos", async () => {
    const fake = createFakeSupabase({
      perfil_rol: [
        { perfil_id: "p1", rol: "docente" },
        { perfil_id: "p2", rol: "estudiante" },
      ],
      perfiles: [{ id: "p1", nombres: "Leo", apellidos: "Brouwer" }],
      docente_instrumento: [{ docente_id: "p1", instrumento_id: "i1" }],
      catedras: [
        {
          id: "c1",
          codigo: "CAT-2026-01",
          estado: "en_curso",
          docente_id: "p1",
          cursos: { nombre: "Guitarra", instrumento_id: "i1", instrumentos: { nombre: "Guitarra" } },
          docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
          inscripciones: [{ estado: "activa" }, { estado: "pendiente" }],
        },
      ],
      sesiones: [{ catedra_id: "c1" }, { catedra_id: "c1" }, { catedra_id: "c2" }],
    })

    const result = await getAsignaciones(fake)

    expect(result.error).toBeNull()
    expect(result.data!.docentes).toEqual([
      { id: "p1", nombre: "Leo Brouwer", instrumentoIds: ["i1"] },
    ])
    expect(result.data!.catedras[0]).toMatchObject({
      catedraId: "c1",
      codigo: "CAT-2026-01",
      curso: "Guitarra",
      instrumentoId: "i1",
      instrumento: "Guitarra",
      docenteId: "p1",
      docente: "Leo Brouwer",
      estudiantesActivos: 1,
      sesiones: 2,
      estado: "en_curso",
    })
  })

  it("getAsignaciones tolera cursos sin instrumento y docente sin perfil", async () => {
    const fake = createFakeSupabase({
      perfil_rol: [{ perfil_id: "p1", rol: "docente" }],
      perfiles: [{ id: "p1", nombres: "Leo", apellidos: "Brouwer" }],
      catedras: [
        {
          id: "c1",
          codigo: "CAT-2026-02",
          estado: "planificada",
          docente_id: "p1",
          cursos: null,
          docentes: null,
          inscripciones: [],
        },
      ],
    })

    const result = await getAsignaciones(fake)

    expect(result.data!.catedras[0]).toMatchObject({
      curso: "Sin curso",
      instrumentoId: null,
      instrumento: null,
      docente: null,
      estudiantesActivos: 0,
      sesiones: 0,
    })
  })

  it("getAsignaciones propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("catedras", "boom"))

    await expect(getAsignaciones()).resolves.toEqual({ data: null, error: "boom" })
  })

  it("reasignarCatedras llama al rpc y devuelve el conteo", async () => {
    const rpc = vi.fn(() => 3)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { reasignar_catedras: rpc } }),
    )

    const result = await reasignarCatedras({ catedraIds: ["c1", "c2"], docenteId: "p1" })

    expect(result).toEqual({ data: { actualizadas: 3 }, error: null })
    expect(rpc).toHaveBeenCalledWith({ p_catedra_ids: ["c1", "c2"], p_docente_id: "p1" })
  })

  it("reasignarCatedras propaga el error del bloqueo por instrumento", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("rpc:reasignar_catedras", "El docente no enseña el instrumento requerido por: CAT-1"),
    )

    await expect(reasignarCatedras({ catedraIds: ["c1"], docenteId: "p2" })).resolves.toEqual({
      data: null,
      error: "El docente no enseña el instrumento requerido por: CAT-1",
    })
  })
})
