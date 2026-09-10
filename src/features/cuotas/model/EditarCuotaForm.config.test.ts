import { describe, expect, it } from "vitest"

import { editarCuotaFormSchema, mapCuotaToFormValues } from "./EditarCuotaForm.config"

describe("editarCuotaFormSchema", () => {
  it("rechaza monto no positivo y fecha vacía", () => {
    expect(editarCuotaFormSchema.safeParse({ monto: 0, fechaVencimiento: "2026-06-01" }).success).toBe(false)
    expect(editarCuotaFormSchema.safeParse({ monto: 10, fechaVencimiento: "" }).success).toBe(false)
  })

  it("coerciona el monto", () => {
    const result = editarCuotaFormSchema.parse({ monto: "75.5", fechaVencimiento: "2026-06-01" })
    expect(result.monto).toBe(75.5)
  })
})

describe("mapCuotaToFormValues", () => {
  it("mapea la cuota y usa cadena vacía sin fecha", () => {
    expect(
      mapCuotaToFormValues({
        id: "c1",
        periodo: "2026-06",
        estudiante: "Ada Lovelace",
        monto: 50,
        montoPagado: 0,
        saldo: 50,
        fechaVencimiento: null,
        estado: "pendiente",
      }),
    ).toEqual({ monto: 50, fechaVencimiento: "" })

    expect(
      mapCuotaToFormValues({
        id: "c1",
        periodo: "2026-06",
        estudiante: "Ada Lovelace",
        monto: 50,
        montoPagado: 0,
        saldo: 50,
        fechaVencimiento: "2026-06-05",
        estado: "pendiente",
      }),
    ).toEqual({ monto: 50, fechaVencimiento: "2026-06-05" })
  })
})
