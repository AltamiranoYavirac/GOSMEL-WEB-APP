import { describe, expect, it } from "vitest"

import {
  buildCrearDocentePayload,
  crearDocenteFormSchema,
  getCrearDocenteFormDefaults,
  slugifyNombre,
} from "./CrearDocenteForm.config"

describe("slugifyNombre", () => {
  it("quita acentos y pasa a kebab-case", () => {
    expect(slugifyNombre("José Núñez")).toBe("jose-nunez")
    expect(slugifyNombre("María José")).toBe("maria-jose")
  })

  it("colapsa símbolos y espacios en un solo guion", () => {
    expect(slugifyNombre("  ¡Hola,   Mundo!  ")).toBe("hola-mundo")
    expect(slugifyNombre("a---b")).toBe("a-b")
  })

  it("recorta guiones al inicio y al final", () => {
    expect(slugifyNombre(" -abc- ")).toBe("abc")
  })

  it("devuelve cadena vacía si no queda nada", () => {
    expect(slugifyNombre("¡!")).toBe("")
    expect(slugifyNombre("")).toBe("")
  })
})

describe("crearDocenteFormSchema", () => {
  it("rechaza perfilId vacío y experiencia negativa", () => {
    const result = crearDocenteFormSchema.safeParse({
      ...getCrearDocenteFormDefaults(),
      perfilId: "",
      aniosExperiencia: -1,
    })
    expect(result.success).toBe(false)
  })

  it("acepta experiencia nula y varios instrumentos", () => {
    const result = crearDocenteFormSchema.parse({
      ...getCrearDocenteFormDefaults(),
      perfilId: "p1",
      instrumentoIds: ["i1", "i2"],
      instrumentoPrincipalId: "i2",
      aniosExperiencia: null,
    })

    expect(result.aniosExperiencia).toBeNull()
    expect(result.instrumentoIds).toEqual(["i1", "i2"])
  })

  it("exige que el instrumento principal esté entre los seleccionados", () => {
    const result = crearDocenteFormSchema.safeParse({
      ...getCrearDocenteFormDefaults(),
      perfilId: "p1",
      instrumentoIds: ["i1"],
      instrumentoPrincipalId: "i2",
    })

    expect(result.success).toBe(false)
  })

  it("rechaza slugs que no son kebab-case", () => {
    const result = crearDocenteFormSchema.safeParse({
      ...getCrearDocenteFormDefaults(),
      perfilId: "p1",
      slug: "Leo Brouwer",
    })

    expect(result.success).toBe(false)
  })
})

describe("getCrearDocenteFormDefaults", () => {
  it("devuelve defaults sin publicar y sin experiencia", () => {
    expect(getCrearDocenteFormDefaults()).toEqual({
      perfilId: "",
      slug: "",
      tituloProfesional: "",
      instrumentoIds: [],
      instrumentoPrincipalId: "",
      aniosExperiencia: null,
      fraseDestacada: "",
      biografia: "",
      publicado: false,
      destacado: false,
    })
  })
})

describe("buildCrearDocentePayload", () => {
  it("usa el slug provisto (trim) y omite opcionales vacíos", () => {
    const payload = buildCrearDocentePayload(
      {
        ...getCrearDocenteFormDefaults(),
        perfilId: "p1",
        slug: " mi-slug ",
        aniosExperiencia: 4,
      },
      "José Núñez",
    )

    expect(payload).toEqual({
      perfil_id: "p1",
      slug: "mi-slug",
      titulo_profesional: undefined,
      biografia: undefined,
      frase_destacada: undefined,
      anios_experiencia: 4,
      instrumento_ids: [],
      instrumento_principal_id: undefined,
      publicado: false,
      destacado: false,
    })
  })

  it("envía instrumentos seleccionados y el principal", () => {
    const payload = buildCrearDocentePayload(
      {
        ...getCrearDocenteFormDefaults(),
        perfilId: "p1",
        instrumentoIds: ["i1", "i2"],
        instrumentoPrincipalId: "i1",
      },
      "José Núñez",
    )

    expect(payload.instrumento_ids).toEqual(["i1", "i2"])
    expect(payload.instrumento_principal_id).toBe("i1")
    expect(payload.anios_experiencia).toBeUndefined()
  })

  it("deriva el slug del nombre del perfil cuando no se provee", () => {
    const payload = buildCrearDocentePayload(
      { ...getCrearDocenteFormDefaults(), perfilId: "p1" },
      "José Núñez",
    )

    expect(payload.slug).toBe("jose-nunez")
  })

  it("cae al id del perfil si el nombre no produce slug", () => {
    const payload = buildCrearDocentePayload(
      { ...getCrearDocenteFormDefaults(), perfilId: "abcdef1234" },
      "¡!",
    )

    expect(payload.slug).toBe("docente-abcdef")
  })
})
