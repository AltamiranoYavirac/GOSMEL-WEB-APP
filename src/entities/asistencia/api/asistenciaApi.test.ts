import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeTables } from "@/test/supabase.types"

import { getAsistenciasSesion } from "./getAsistenciasSesion"
import { guardarAsistenciasSesion } from "./guardarAsistenciasSesion"

function configure(tables: TFakeTables = {}) {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

describe("asistencia API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("mezcla las inscripciones activas con las asistencias y ordena por nombre", async () => {
    configure({
      sesiones: [
        {
          id: "s1",
          catedra_id: "c1",
          fecha: "2026-06-15",
          hora_inicio: "15:00:00",
          hora_fin: "16:00:00",
          tema: null,
          catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        },
      ],
      inscripciones: [
        {
          id: "i2",
          estudiante_id: "e2",
          catedra_id: "c1",
          estado: "activa",
          estudiantes: { id: "e2", nombres: "Zoe", apellidos: "Zapata" },
        },
        {
          id: "i1",
          estudiante_id: "e1",
          catedra_id: "c1",
          estado: "activa",
          estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" },
        },
        {
          id: "i3",
          estudiante_id: "e3",
          catedra_id: "c1",
          estado: "pendiente",
          estudiantes: { id: "e3", nombres: "Solicitud", apellidos: "Pendiente" },
        },
      ],
      asistencias: [{ sesion_id: "s1", inscripcion_id: "i1", estado: "ausente", observacion: "enferma" }],
    })

    const result = await getAsistenciasSesion("s1")

    expect(result.error).toBeNull()
    expect(result.data).toMatchObject({ codigo: "C-01", curso: "Guitarra", horaInicio: "15:00:00" })
    expect(result.data?.estudiantes.map((item) => item.estudianteNombre)).toEqual([
      "Ada Lovelace",
      "Zoe Zapata",
    ])
    expect(result.data?.estudiantes[0]).toMatchObject({ estado: "ausente", observacion: "enferma" })
    expect(result.data?.estudiantes[1].estado).toBe("presente")
  })

  it("propaga el error cuando la sesión no existe", async () => {
    configure({ sesiones: [] })

    const result = await getAsistenciasSesion("missing")

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("guarda la asistencia normalizando la observación", async () => {
    const tables: TFakeTables = { asistencias: [] }
    configure(tables)

    await expect(
      guardarAsistenciasSesion("s1", [
        { inscripcionId: "i1", estado: "presente", observacion: "  ok  " },
        { inscripcionId: "i2", estado: "ausente" },
      ]),
    ).resolves.toEqual({ error: null })

    expect(tables.asistencias[0]).toMatchObject({
      sesion_id: "s1",
      inscripcion_id: "i1",
      estado: "presente",
      observacion: "ok",
    })
    expect(tables.asistencias[1]).toMatchObject({ inscripcion_id: "i2", observacion: null })
  })

  it("propaga el error al guardar", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("asistencias", "boom"))

    await expect(guardarAsistenciasSesion("s1", [])).resolves.toEqual({ error: "boom" })
  })
})
