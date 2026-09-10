import { describe, expect, it } from "vitest"

import {
  buildContactPayload,
  contactFormSchema,
  getContactFormDefaults,
} from "./contactForm.config"

function validValues() {
  return {
    ...getContactFormDefaults(),
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    message: "Quiero información sobre clases de guitarra",
    consent: true as const,
  }
}

describe("contactFormSchema", () => {
  it("rechaza nombre corto, email inválido y mensaje corto", () => {
    expect(contactFormSchema.safeParse({ ...validValues(), fullName: "A" }).success).toBe(false)
    expect(contactFormSchema.safeParse({ ...validValues(), email: "nope" }).success).toBe(false)
    expect(contactFormSchema.safeParse({ ...validValues(), message: "corto" }).success).toBe(false)
  })

  it("valida el teléfono y permite vacío", () => {
    expect(contactFormSchema.safeParse({ ...validValues(), phone: "" }).success).toBe(true)
    expect(contactFormSchema.safeParse({ ...validValues(), phone: "+593 99 123 4567" }).success).toBe(true)
    expect(contactFormSchema.safeParse({ ...validValues(), phone: "abc" }).success).toBe(false)
  })

  it("exige consentimiento true", () => {
    expect(contactFormSchema.safeParse({ ...validValues(), consent: false }).success).toBe(false)
  })

  it("exige instrumentoId uuid cuando se provee", () => {
    expect(contactFormSchema.safeParse({ ...validValues(), instrumentoId: "no-uuid" }).success).toBe(false)
    expect(
      contactFormSchema.safeParse({
        ...validValues(),
        instrumentoId: "11111111-1111-4111-8111-111111111111",
      }).success,
    ).toBe(true)
  })
})

describe("getContactFormDefaults", () => {
  it("devuelve defaults de contacto general", () => {
    const defaults = getContactFormDefaults()
    expect(defaults.tipo).toBe("contacto_general")
    expect(defaults.phone).toBe("")
    expect(defaults.instrumentoId).toBe("")
  })
})

describe("buildContactPayload", () => {
  it("recorta strings y convierte vacíos a null", () => {
    const payload = buildContactPayload(
      {
        ...validValues(),
        fullName: "  Ada Lovelace  ",
        email: "  ada@example.com ",
        phone: "   ",
        instrumentoId: "",
        message: "  Hola mundo largo  ",
      },
      "https://gosmel.app/contact",
    )

    expect(payload).toEqual({
      tipo: "contacto_general",
      nombre_completo: "Ada Lovelace",
      email: "ada@example.com",
      telefono: null,
      instrumento_id: null,
      mensaje: "Hola mundo largo",
      para_menor: false,
      consentimiento_datos: true,
      origen_url: "https://gosmel.app/contact",
    })
  })

  it("conserva teléfono e instrumento cuando existen", () => {
    const payload = buildContactPayload(
      {
        ...validValues(),
        phone: "0991234567",
        instrumentoId: "11111111-1111-4111-8111-111111111111",
      },
      "/contact",
    )

    expect(payload.telefono).toBe("0991234567")
    expect(payload.instrumento_id).toBe("11111111-1111-4111-8111-111111111111")
  })
})
