import { describe, expect, it } from "vitest"

import { bajaEstudianteFormSchema } from "./BajaEstudianteForm.config"
import { editarEstudianteFormSchema } from "./EditarEstudianteForm.config"

describe("editarEstudianteFormSchema", () => {
  it("rechaza nombres cortos y fecha vacía", () => {
    const base = { nombres: "Ada", apellidos: "Lovelace", fechaNacimiento: "2010-01-01", activo: true }

    expect(editarEstudianteFormSchema.safeParse({ ...base, nombres: "A" }).success).toBe(false)
    expect(editarEstudianteFormSchema.safeParse({ ...base, fechaNacimiento: "" }).success).toBe(false)
  })

  it("valida cédula y celular opcionales", () => {
    const base = { nombres: "Ada", apellidos: "Lovelace", fechaNacimiento: "2010-01-01", activo: true }

    expect(editarEstudianteFormSchema.safeParse({ ...base, cedula: "1234" }).success).toBe(false)
    expect(editarEstudianteFormSchema.safeParse({ ...base, cedula: "12345" }).success).toBe(true)
    expect(editarEstudianteFormSchema.safeParse({ ...base, celular: "+593991234567" }).success).toBe(true)
    expect(editarEstudianteFormSchema.safeParse({ ...base, celular: "abc" }).success).toBe(false)
  })

  it("valida email opcional", () => {
    const base = { nombres: "Ada", apellidos: "Lovelace", fechaNacimiento: "2010-01-01", activo: true }

    expect(editarEstudianteFormSchema.safeParse({ ...base, email: "" }).success).toBe(true)
    expect(editarEstudianteFormSchema.safeParse({ ...base, email: "ada@example.com" }).success).toBe(true)
    expect(editarEstudianteFormSchema.safeParse({ ...base, email: "nope" }).success).toBe(false)
  })
})

describe("bajaEstudianteFormSchema", () => {
  it("acepta motivo vacío y condonación", () => {
    expect(bajaEstudianteFormSchema.parse({ motivo: "", condonarCuotasPendientes: true })).toEqual({
      motivo: "",
      condonarCuotasPendientes: true,
    })
  })

  it("rechaza estructura inválida", () => {
    expect(bajaEstudianteFormSchema.safeParse({ motivo: 1 }).success).toBe(false)
  })
})
