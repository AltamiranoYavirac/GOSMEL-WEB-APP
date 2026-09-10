import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseServerClientMock } = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { getDashboardOverview } from "./getDashboardOverview"

const USER = { id: "u1" }

function buildTables() {
  return {
    perfiles: [{ id: "u1", nombres: "Ada" }],
    estudiantes: [
      { id: "e1", activo: true, created_at: "2026-02-10" },
      { id: "e2", activo: true, created_at: "2026-03-10" },
      { id: "e3", activo: true, created_at: "2026-06-01" },
      { id: "e4", activo: false, created_at: "2025-12-15" },
    ],
    docentes: [{ perfil_id: "d1" }, { perfil_id: "d2" }],
    solicitudes: [
      { id: "s1", estado: "nueva", tipo: "clase_prueba", nombre_completo: "Juan Pérez", created_at: "2026-06-14" },
      { id: "s2", estado: "contactada", tipo: "admision", nombre_completo: "Ana Gómez", created_at: "2026-06-02" },
      { id: "s3", estado: "convertida", tipo: "otro_tipo", nombre_completo: null, created_at: "2026-05-20" },
      { id: "s4", estado: "descartada", tipo: "masterclass", nombre_completo: "Luis", created_at: "2026-01-10" },
    ],
    catedras: [
      { id: "c1", estado: "en_curso" },
      { id: "c2", estado: "en_curso" },
      { id: "c3", estado: "planificada" },
      { id: "c4", estado: "finalizada" },
    ],
    sesiones: [{ id: "se1", fecha: "2026-06-15" }],
    pagos: [
      {
        id: "p1",
        monto: 100,
        fecha_pago: "2026-06-10",
        created_at: "2026-06-10T10:00:00",
        cuotas: { acuerdos_pago: { estudiantes: { nombres: "Ada", apellidos: "Lovelace" } } },
      },
      { id: "p2", monto: 50, fecha_pago: "2026-06-05", created_at: "2026-06-05T10:00:00", cuotas: null },
      { id: "p3", monto: 100, fecha_pago: "2026-05-10", created_at: "2026-05-10T10:00:00", cuotas: null },
      { id: "p4", monto: 20, fecha_pago: "2026-02-10", created_at: "2026-02-10T10:00:00", cuotas: null },
    ],
    cuotas: [
      { id: "q1", estado: "pendiente", fecha_vencimiento: "2026-05-01" },
      { id: "q2", estado: "pagada", fecha_vencimiento: "2026-05-01" },
      { id: "q3", estado: "parcial", fecha_vencimiento: "2026-07-01" },
    ],
    inscripciones: [
      { id: "i1", fecha_inscripcion: "2026-06-01" },
      { id: "i2", fecha_inscripcion: "2026-06-10" },
      { id: "i3", fecha_inscripcion: "2026-05-01" },
      { id: "i4", fecha_inscripcion: "2026-05-20" },
    ],
    estudiante_instrumento: [
      { instrumento_id: "i1", instrumentos: { nombre: "Guitarra" } },
      { instrumento_id: "i1", instrumentos: { nombre: "Guitarra" } },
      { instrumento_id: "i2", instrumentos: { nombre: "Piano" } },
      { instrumento_id: "i3", instrumentos: null },
    ],
  }
}

describe("getDashboardOverview", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))
    createSupabaseServerClientMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve agregados de todas las secciones", async () => {
    createSupabaseServerClientMock.mockResolvedValue(createFakeSupabase(buildTables(), { user: USER }))

    const result = await getDashboardOverview()

    expect(result.error).toBeNull()
    const data = result.data!

    expect(data.adminName).toBe("Ada")
    expect(data.solicitudesPendientes).toBe(2)
    expect(data.kpis).toHaveLength(8)

    expect(data.kpis[0]).toMatchObject({ label: "Estudiantes activos", value: 3 })
    expect(data.kpis[0].spark).toHaveLength(6)
    expect(data.kpis[0].spark!.at(-1)).toBe(3)
    expect(data.kpis[1].value).toBe(2)
    expect(data.kpis[2]).toMatchObject({ value: 2, trend: 0 })

    const ingresos = data.kpis[3]
    expect(ingresos.value).toBe(150)
    expect(ingresos.trend).toBe(50)
    expect(ingresos.spark).toEqual(
      expect.arrayContaining([150, 100, 20]),
    )

    expect(data.kpis[4].value).toBe(2)
    expect(data.kpis[5]).toMatchObject({ value: 1, pill: "Requieren atención" })
    expect(data.kpis[6].value).toBe(1)
    expect(data.kpis[7]).toMatchObject({ value: 2, trend: 0 })

    expect(data.revenue).toHaveLength(6)
    expect(data.revenue.reduce((sum, point) => sum + point.total, 0)).toBe(270)
    expect(data.revenue.at(-1)!.total).toBe(150)

    expect(data.solicitudesPorEstado.map((item) => item.total)).toEqual([1, 1, 1, 1])

    expect(data.instrumentosDemandados[0]).toEqual({ instrumento: "Guitarra", total: 2 })
    expect(data.instrumentosDemandados).toHaveLength(3)

    expect(data.solicitudesRecientes).toHaveLength(4)
    expect(data.solicitudesRecientes[0]).toMatchObject({
      id: "s1",
      title: "Juan Pérez",
      href: "/dashboard/admin/solicitudes",
      initials: "JP",
    })
    expect(data.solicitudesRecientes[2].badge?.label).toBe("otro tipo")
    expect(data.solicitudesRecientes[2].title).toBe("Sin nombre")

    expect(data.pagosRecientes).toHaveLength(4)
    expect(data.pagosRecientes[0]).toMatchObject({ title: "Ada Lovelace", subtitle: "$100.00" })
    expect(data.pagosRecientes[1].title).toBe("Estudiante")
  })

  it("devuelve estructura vacía sin datos ni usuario", async () => {
    createSupabaseServerClientMock.mockResolvedValue(createFakeSupabase({}))

    const result = await getDashboardOverview()

    expect(result.error).toBeNull()
    const data = result.data!

    expect(data.adminName).toBe("administrador")
    expect(data.solicitudesPendientes).toBe(0)
    expect(data.kpis.every((kpi) => kpi.value === 0)).toBe(true)
    expect(data.revenue.every((point) => point.total === 0)).toBe(true)
    expect(data.instrumentosDemandados).toEqual([])
    expect(data.solicitudesRecientes).toEqual([])
    expect(data.pagosRecientes).toEqual([])
    expect(data.solicitudesPorEstado.every((item) => item.total === 0)).toBe(true)
  })

  it("propaga el primer error", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase.withError("pagos", "boom", buildTables(), { user: USER }),
    )

    const result = await getDashboardOverview()

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
