import { describe, expect, it } from "vitest"

import { METODO_PAGO_OPCIONES, registrarPagoFormSchema } from "./RegistrarPagoForm.config"

describe("registrarPagoFormSchema", () => {
  it("rechaza monto inválido, método vacío y fecha vacía", () => {
    const base = { monto: 50, metodo: "transferencia", fechaPago: "2026-06-01" }

    expect(registrarPagoFormSchema.safeParse(base).success).toBe(true)
    expect(registrarPagoFormSchema.safeParse({ ...base, monto: 0 }).success).toBe(false)
    expect(registrarPagoFormSchema.safeParse({ ...base, metodo: "" }).success).toBe(false)
    expect(registrarPagoFormSchema.safeParse({ ...base, fechaPago: "" }).success).toBe(false)
  })

  it("coerciona el monto y acepta opcionales", () => {
    const parsed = registrarPagoFormSchema.parse({
      monto: "75",
      metodo: "efectivo",
      fechaPago: "2026-06-01",
      referencia: "REF",
      observacion: "",
    })

    expect(parsed.monto).toBe(75)
    expect(parsed.referencia).toBe("REF")
  })

  it("expone las opciones de método", () => {
    expect(METODO_PAGO_OPCIONES.map((option) => option.value)).toContain("transferencia")
  })
})
