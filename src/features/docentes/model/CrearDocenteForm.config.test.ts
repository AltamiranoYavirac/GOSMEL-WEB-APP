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
  it("rechaza perfilId vacío y experiencia negativa o no numérica", () => {
    const result = crearDocenteFormSchema.safeParse({
      perfilId: "",
      aniosExperiencia: -1,
      publicado: true,
      destacado: false,
    })
    expect(result.success).toBe(false)
  })

  it("coerciona aniosExperiencia y acepta el payload válido", () => {
    const result = crearDocenteFormSchema.parse({
      perfilId: "p1",
      slug: "",
      tituloProfesional: "",
      instrumentoId: "",
      aniosExperiencia: "5",
      fraseDestacada: "",
      biografia: "",
      publicado: true,
      destacado: false,
    })

    expect(result.aniosExperiencia).toBe(5)
  })
})

describe("getCrearDocenteFormDefaults", () => {
  it("devuelve defaults publicados", () => {
    expect(getCrearDocenteFormDefaults()).toEqual({
      perfilId: "",
      slug: "",
      tituloProfesional: "",
      instrumentoId: "",
      aniosExperiencia: 3,
      fraseDestacada: "",
      biografia: "",
      publicado: true,
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
      instrumento_id: undefined,
      publicado: true,
      destacado: false,
    })
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
