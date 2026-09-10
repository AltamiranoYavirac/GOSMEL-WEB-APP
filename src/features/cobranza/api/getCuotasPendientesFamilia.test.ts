import { describe, expect, it } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getCuotasPendientesFamilia } from "./getCuotasPendientesFamilia"

describe("getCuotasPendientesFamilia", () => {
  it("devuelve [] si el representante no tiene vínculos", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      createFakeSupabase({ estudiante_representante: [] }),
    )

    expect(result).toEqual({ data: [], error: null })
  })

  it("mapea la vista de estado de cuenta y filtra filas incompletas", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      createFakeSupabase({
        estudiante_representante: [
          { representante_id: "r1", estudiante_id: "e1" },
          { representante_id: "r1", estudiante_id: "e2" },
          { representante_id: "r2", estudiante_id: "e3" },
        ],
        v_estado_cuenta: [
          {
            cuota_id: "q2",
            estudiante_id: "e2",
            estudiante: "Alan Turing",
            periodo_mes: "2026-06",
            monto: 40,
            monto_pagado: 0,
            saldo: 40,
            fecha_vencimiento: "2026-06-10",
            estado_efectivo: "vencida",
          },
          {
            cuota_id: "q1",
            estudiante_id: "e1",
            estudiante: "Ada Lovelace",
            periodo_mes: "2026-05",
            monto: 50,
            monto_pagado: 20,
            saldo: 30,
            fecha_vencimiento: "2026-05-10",
            estado_efectivo: "parcial",
          },
          {
            cuota_id: "q3",
            estudiante_id: "e3",
            estudiante: "Fuera del vínculo",
            periodo_mes: "2026-06",
            monto: 10,
            monto_pagado: 0,
            saldo: 10,
            fecha_vencimiento: "2026-06-10",
            estado_efectivo: "pendiente",
          },
          {
            cuota_id: null,
            estudiante_id: "e1",
            estudiante: null,
            periodo_mes: "2026-06",
            monto: 10,
            monto_pagado: 0,
            saldo: 10,
            fecha_vencimiento: null,
            estado_efectivo: "pendiente",
          },
        ],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data!.map((item) => item.cuotaId)).toEqual(["q1", "q2"])
    expect(result.data![0]).toMatchObject({
      estudianteId: "e1",
      estudianteNombre: "Ada Lovelace",
      periodoMes: "2026-05",
      monto: 50,
      montoPagado: 20,
      saldo: 30,
    })
  })

  it("cae al query directo de cuotas si la vista falla", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      createFakeSupabase.withError(
        "v_estado_cuenta",
        "vista caída",
        {
          estudiante_representante: [{ representante_id: "r1", estudiante_id: "e1" }],
          cuotas: [
            {
              id: "q1",
              monto: 50,
              monto_pagado: 20,
              fecha_vencimiento: "2026-06-05",
              estado: "parcial",
              periodo_mes: "2026-06",
              acuerdos_pago: {
                estudiante_id: "e1",
                estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" },
              },
            },
            {
              id: "q2",
              monto: 50,
              monto_pagado: 50,
              fecha_vencimiento: "2026-05-05",
              estado: "parcial",
              periodo_mes: "2026-05",
              acuerdos_pago: {
                estudiante_id: "e1",
                estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" },
              },
            },
            {
              id: "q3",
              monto: 50,
              monto_pagado: 0,
              fecha_vencimiento: "2026-06-05",
              estado: "pendiente",
              periodo_mes: "2026-06",
              acuerdos_pago: {
                estudiante_id: "e9",
                estudiantes: { id: "e9", nombres: "Otro", apellidos: "Estudiante" },
              },
            },
          ],
        },
        {},
      ),
    )

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toMatchObject({ cuotaId: "q1", saldo: 30, estudianteNombre: "Ada Lovelace" })
  })

  it("propaga el error de vínculos", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      createFakeSupabase.withError("estudiante_representante", "boom"),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
