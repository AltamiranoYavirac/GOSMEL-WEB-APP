import { describe, expect, it } from "vitest"

import {
  buildCrearEstudiantePayload,
  crearEstudianteFormSchema,
  getCrearEstudianteFormDefaults,
} from "./CrearEstudianteForm.config"

function validValues() {
  return {
    ...getCrearEstudianteFormDefaults(),
    nombres: "Ada",
    apellidos: "Lovelace",
    fechaNacimiento: "2015-06-15",
    representanteId: "rep-1",
  }
}

describe("crearEstudianteFormSchema", () => {
  it("rechaza requeridos faltantes", () => {
    const result = crearEstudianteFormSchema.safeParse({
      ...getCrearEstudianteFormDefaults(),
      nombres: "A",
      apellidos: "",
      fechaNacimiento: "",
    })

    expect(result.success).toBe(false)
  })

  it("acepta email vacío pero rechaza email inválido", () => {
    expect(crearEstudianteFormSchema.safeParse({ ...validValues(), email: "" }).success).toBe(true)
    expect(crearEstudianteFormSchema.safeParse({ ...validValues(), email: "no-es-email" }).success).toBe(false)
  })

  it("exige representante cuando esMenor es true", () => {
    const result = crearEstudianteFormSchema.safeParse({
      ...validValues(),
      esMenor: true,
      representanteId: "",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["representanteId"])
    }
  })

  it("no exige representante cuando esMenor es false", () => {
    const result = crearEstudianteFormSchema.safeParse({
      ...validValues(),
      esMenor: false,
      representanteId: "",
    })

    expect(result.success).toBe(true)
  })
})

describe("getCrearEstudianteFormDefaults", () => {
  it("usa representante por defecto vacío", () => {
    const defaults = getCrearEstudianteFormDefaults()
    expect(defaults.esMenor).toBe(true)
    expect(defaults.representanteId).toBe("")
    expect(defaults.nivel).toBe("iniciacion")
  })

  it("usa el representante provisto", () => {
    expect(getCrearEstudianteFormDefaults("rep-1").representanteId).toBe("rep-1")
  })
})

describe("buildCrearEstudiantePayload", () => {
  it("asocia representante y parentesco solo si esMenor y hay representante", () => {
    const payload = buildCrearEstudiantePayload({
      ...validValues(),
      esMenor: true,
      representanteId: "rep-1",
      parentesco: "padre",
      cedula: "",
      celular: "",
      email: "",
    })

    expect(payload.representante_id).toBe("rep-1")
    expect(payload.parentesco).toBe("padre")
    expect(payload.cedula).toBeUndefined()
    expect(payload.celular).toBeUndefined()
    expect(payload.email).toBeUndefined()
    expect(payload.nivel_musical).toBe("iniciacion")
  })

  it("omite representante si esMenor es false aunque haya id", () => {
    const payload = buildCrearEstudiantePayload({
      ...validValues(),
      esMenor: false,
      representanteId: "rep-1",
      parentesco: "madre",
    })

    expect(payload.representante_id).toBeUndefined()
    expect(payload.parentesco).toBeUndefined()
  })

  it("omite representante si esMenor es true pero no hay id", () => {
    const payload = buildCrearEstudiantePayload({
      ...validValues(),
      esMenor: true,
      representanteId: "",
    })

    expect(payload.representante_id).toBeUndefined()
    expect(payload.parentesco).toBeUndefined()
  })
})
