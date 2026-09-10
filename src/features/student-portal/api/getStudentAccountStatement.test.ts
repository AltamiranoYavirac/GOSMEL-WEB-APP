import { describe, expect, it } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getStudentAccountStatement } from "./getStudentAccountStatement"

function buildTables() {
  return {
    v_estado_cuenta: [
      {
        estudiante_id: "e1",
        cuota_id: "q1",
        periodo_mes: "2026-06",
        monto: 50,
        monto_pagado: 20,
        saldo: 30,
        fecha_vencimiento: "2026-06-05",
        estado_efectivo: "parcial",
        dias_mora: 10,
      },
      {
        estudiante_id: "e1",
        cuota_id: "q2",
        periodo_mes: "2026-05",
        monto: 50,
        monto_pagado: 0,
        saldo: 50,
        fecha_vencimiento: "2026-05-05",
        estado_efectivo: "vencida",
        dias_mora: 41,
      },
    ],
    acuerdos_pago: [
      { estudiante_id: "e1", monto_mensual: 50, moneda: "USD", dia_cobro: 5, estado: "vigente" },
      { estudiante_id: "e1", monto_mensual: 30, moneda: "USD", dia_cobro: 5, estado: "vigente" },
      { estudiante_id: "e1", monto_mensual: 999, moneda: "USD", dia_cobro: 5, estado: "cancelado" },
    ],
    configuracion_sitio: [
      { id: 1, telefono: "099", whatsapp: "0999", email_general: "info@gosmel.app", horario_atencion: "9-17" },
    ],
    pagos: [
      {
        id: "p1",
        fecha_pago: "2026-06-10",
        monto: 20,
        metodo: "transferencia",
        referencia: "REF-1",
        comprobante_storage_path: "comprobantes/p1.pdf",
        estado: "aprobado",
        observacion: null,
        cuota_id: "q1",
        cuotas: { periodo_mes: "2026-06" },
      },
      {
        id: "p2",
        fecha_pago: "2026-06-12",
        monto: 50,
        metodo: "efectivo",
        referencia: null,
        comprobante_storage_path: null,
        estado: "pendiente_verificacion",
        observacion: "revisar",
        cuota_id: "q2",
        cuotas: { periodo_mes: "2026-05" },
      },
    ],
  }
}

describe("getStudentAccountStatement", () => {
  it("mapea cuotas, pagos, acuerdo y contacto", async () => {
    const result = await getStudentAccountStatement("e1", createFakeSupabase(buildTables()))

    expect(result.error).toBeNull()
    expect(result.data!.cuotas).toHaveLength(2)
    expect(result.data!.cuotas[0]).toMatchObject({
      cuotaId: "q1",
      saldo: 30,
      diasMora: 10,
      tienePagoPendiente: false,
    })
    expect(result.data!.cuotas[1]).toMatchObject({
      cuotaId: "q2",
      estadoEfectivo: "vencida",
      tienePagoPendiente: true,
    })

    expect(result.data!.acuerdo).toEqual({
      montoMensual: 80,
      moneda: "USD",
      diaCobro: 5,
      estado: "vigente",
    })

    expect(result.data!.pagos).toHaveLength(2)
    expect(result.data!.pagos[0]).toMatchObject({
      id: "p2",
      periodo: "2026-05",
      monto: 50,
      estado: "pendiente_verificacion",
    })

    expect(result.data!.contacto).toEqual({
      telefono: "099",
      whatsapp: "0999",
      emailGeneral: "info@gosmel.app",
      horarioAtencion: "9-17",
    })
  })

  it("omite pagos y acuerdo cuando no hay datos", async () => {
    const result = await getStudentAccountStatement(
      "e1",
      createFakeSupabase({ v_estado_cuenta: [], acuerdos_pago: [] }),
    )

    expect(result.error).toBeNull()
    expect(result.data!.pagos).toEqual([])
    expect(result.data!.acuerdo).toBeNull()
    expect(result.data!.cuotas).toEqual([])
    expect(result.data!.contacto.telefono).toBeNull()
  })

  it("propaga errores de cuentas, pagos y acuerdos", async () => {
    await expect(
      getStudentAccountStatement("e1", createFakeSupabase.withError("v_estado_cuenta", "boom")),
    ).resolves.toEqual({ data: null, error: "boom" })

    await expect(
      getStudentAccountStatement(
        "e1",
        createFakeSupabase.withError("pagos", "boom pagos", buildTables()),
      ),
    ).resolves.toEqual({ data: null, error: "boom pagos" })

    await expect(
      getStudentAccountStatement(
        "e1",
        createFakeSupabase.withError("acuerdos_pago", "boom acuerdos", buildTables()),
      ),
    ).resolves.toEqual({ data: null, error: "boom acuerdos" })
  })
})
