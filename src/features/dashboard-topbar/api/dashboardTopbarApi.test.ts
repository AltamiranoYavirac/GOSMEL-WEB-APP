import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { getTopbarSummary } from "./getTopbarSummary"
import { searchEntities } from "./searchEntities"

describe("dashboard-topbar API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("getTopbarSummary suma pendientes y mapea actividades", async () => {
    const result = await getTopbarSummary(
      createFakeSupabase({
        solicitudes: [
          { id: "s1", estado: "nueva" },
          { id: "s2", estado: "convertida" },
        ],
        cuotas: [
          { id: "q1", estado: "pendiente", fecha_vencimiento: "2026-05-01" },
          { id: "q2", estado: "parcial", fecha_vencimiento: "2026-07-01" },
        ],
        sesiones: [
          { id: "se1", fecha: "2026-06-15", estado: "programada" },
          { id: "se2", fecha: "2026-06-15", estado: "cancelada" },
        ],
        inscripciones: [
          { id: "i1", estado: "pendiente" },
          { id: "i2", estado: "activa" },
        ],
        actividades: [{ id: "a1", tipo: "pago", titulo: "Pago", descripcion: null, created_at: "2026-06-14" }],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data!.counts).toEqual({
      solicitudesPendientes: 1,
      cuotasVencidas: 1,
      sesionesHoy: 1,
      inscripcionesPendientes: 1,
      totalPendientes: 3,
    })
    expect(result.data!.activities).toHaveLength(1)
  })

  it("getTopbarSummary propaga el primer error", async () => {
    const result = await getTopbarSummary(createFakeSupabase.withError("sesiones", "boom"))

    expect(result).toEqual({ data: null, error: "boom" })
  })

  it("searchEntities mapea resultados de las tres tablas", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({
        estudiantes: [{ id: "e1", nombres: "Ada", apellidos: "Lovelace" }],
        docentes: [{ perfil_id: "d1", nombres: "Marta", apellidos: "Argerich", perfiles: { nombres: "Marta", apellidos: "Argerich" } }],
        cursos: [{ id: "k1", nombre: "Guitarra", nivel: "basico" }, { id: "k2", nombre: "Piano", nivel: null }],
      }),
    )

    const result = await searchEntities("a")

    expect(result.error).toBeNull()
    expect(result.data!.estudiantes[0]).toMatchObject({ label: "Ada Lovelace", subtitle: "Estudiante" })
    expect(result.data!.docentes[0]).toMatchObject({ label: "Marta Argerich", subtitle: "Docente" })
    expect(result.data!.cursos[0]).toMatchObject({ subtitle: "Nivel basico" })
    expect(result.data!.cursos[1].subtitle).toBe("Curso")
  })

  it("searchEntities propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("cursos", "boom"))

    await expect(searchEntities("a")).resolves.toEqual({ data: null, error: "boom" })
  })
})
