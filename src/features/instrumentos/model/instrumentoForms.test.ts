import { describe, expect, it } from "vitest"

import {
  getInstrumentoFormDefaults,
  instrumentoFormSchema,
} from "./InstrumentoForm.config"
import {
  getTipoInstrumentoFormDefaults,
  tipoInstrumentoFormSchema,
} from "./TipoInstrumentoForm.config"

describe("instrumentoFormSchema", () => {
  it("rechaza requeridos y aplica defaults", () => {
    expect(instrumentoFormSchema.safeParse({ nombre: "G", tipoInstrumentoId: "t1" }).success).toBe(false)
    expect(instrumentoFormSchema.safeParse({ nombre: "Guitarra", tipoInstrumentoId: "" }).success).toBe(false)
    expect(instrumentoFormSchema.safeParse({ nombre: "Guitarra", tipoInstrumentoId: "t1", orden: -1 }).success).toBe(false)

    const parsed = instrumentoFormSchema.parse({ nombre: "Guitarra", tipoInstrumentoId: "t1" })
    expect(parsed.orden).toBe(0)
    expect(parsed.activo).toBe(true)
  })

  it("acepta opcionales y defaults iniciales", () => {
    const parsed = instrumentoFormSchema.parse({
      nombre: "Guitarra",
      tipoInstrumentoId: "t1",
      icono: "ph:guitar",
      orden: 2,
      activo: false,
    })

    expect(parsed).toMatchObject({ icono: "ph:guitar", orden: 2, activo: false })
    expect(getInstrumentoFormDefaults({ nombre: "Piano" }).nombre).toBe("Piano")
  })
})

describe("tipoInstrumentoFormSchema", () => {
  it("valida nombre y defaults", () => {
    expect(tipoInstrumentoFormSchema.safeParse({ nombre: "C" }).success).toBe(false)

    const parsed = tipoInstrumentoFormSchema.parse({ nombre: "Cuerdas" })
    expect(parsed.orden).toBe(0)
    expect(parsed.activo).toBe(true)

    expect(getTipoInstrumentoFormDefaults({ activo: false }).activo).toBe(false)
  })
})
