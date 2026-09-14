import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { generarSesionesCatedra } from "./generarSesionesCatedra"
import { getCatedrasParaHorarios } from "./getCatedrasParaHorarios"
import { getSesiones } from "./getSesiones"

describe("horarios API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("generarSesionesCatedra llama al rpc con el rango recibido", async () => {
    const rpc = vi.fn(() => 4)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { generar_sesiones_catedra: rpc } }),
    )

    const result = await generarSesionesCatedra({ catedraId: "c1", fechaDesde: "2026-06-01", fechaHasta: "2026-06-30" })

    expect(result).toEqual({ data: 4, error: null })
    expect(rpc).toHaveBeenCalledWith({ p_catedra_id: "c1", p_fecha_desde: "2026-06-01", p_fecha_hasta: "2026-06-30" })
  })

  it("generarSesionesCatedra propaga el error del rpc", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcError: "La fecha de inicio no puede ser anterior al inicio del ciclo (2026-09-19)" }),
    )

    const result = await generarSesionesCatedra({ catedraId: "c1", fechaDesde: "2026-09-01", fechaHasta: "2026-09-30" })

    expect(result.data).toBeNull()
    expect(result.error).toContain("inicio del ciclo")
  })

  it("getCatedrasParaHorarios expone el ciclo y el conteo de inscripciones", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({
        catedras: [
          {
            id: "c1",
            codigo: "CAT-01",
            estado: "planificada",
            fecha_inicio: "2026-09-19",
            fecha_fin: "2026-12-19",
            cursos: { nombre: "Guitarra Acústica Inicial" },
            inscripciones: [{ estado: "activa" }, { estado: "pendiente" }, { estado: "retirada" }],
          },
          {
            id: "c2",
            codigo: "CAT-02",
            estado: "en_curso",
            fecha_inicio: "2026-01-10",
            fecha_fin: null,
            cursos: { nombre: "Piano" },
            inscripciones: [{ estado: "pendiente" }],
          },
          {
            id: "c3",
            codigo: "CAT-03",
            estado: "planificada",
            fecha_inicio: "2026-03-01",
            fecha_fin: null,
            cursos: { nombre: "Batería" },
          },
          {
            id: "c4",
            codigo: "CAT-04",
            estado: "finalizada",
            fecha_inicio: "2025-01-10",
            fecha_fin: null,
            cursos: { nombre: "Violín" },
          },
        ],
      }),
    )

    const result = await getCatedrasParaHorarios()

    expect(result.data).toEqual([
      {
        id: "c1",
        label: "CAT-01 · Guitarra Acústica Inicial",
        fechaInicio: "2026-09-19",
        fechaFin: "2026-12-19",
        activos: 1,
        pendientes: 1,
      },
      {
        id: "c2",
        label: "CAT-02 · Piano",
        fechaInicio: "2026-01-10",
        fechaFin: null,
        activos: 0,
        pendientes: 1,
      },
      {
        id: "c3",
        label: "CAT-03 · Batería",
        fechaInicio: "2026-03-01",
        fechaFin: null,
        activos: 0,
        pendientes: 0,
      },
    ])
  })

  it("getSesiones devuelve las sesiones en orden cronológico", async () => {
    const sesion = (id: string, fecha: string) => ({
      id,
      fecha,
      hora_inicio: "15:00:00",
      hora_fin: "16:00:00",
      tema: null,
      estado: "programada",
      catedra_id: "c1",
      catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
      asistencias: [],
    })

    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({
        sesiones: [sesion("s3", "2026-10-14"), sesion("s1", "2026-09-23"), sesion("s2", "2026-09-30")],
      }),
    )

    const result = await getSesiones()

    expect(result.data?.map((item) => item.fecha)).toEqual(["2026-09-23", "2026-09-30", "2026-10-14"])
  })
})
