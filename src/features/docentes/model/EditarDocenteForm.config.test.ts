import { describe, expect, it } from "vitest"

import {
  buildDocentePatch,
  buildInstrumentosPayload,
  editarDocenteFormSchema,
  getEditarDocenteFormDefaults,
  mapDocenteToFormValues,
} from "./EditarDocenteForm.config"

const DETALLE = {
  slug: "leo-brouwer",
  titulo: "Maestro",
  aniosExperiencia: 10,
  fraseDestacada: "Frase",
  biografia: "Bio",
  redesSociales: { instagram: "@leo", youtube: "leo" },
  instrumentoIds: ["i1", "i2"],
  instrumentoPrincipalId: "i1",
  publicado: true,
  destacado: false,
}

describe("mapDocenteToFormValues", () => {
  it("mapea la entidad a valores del formulario", () => {
    expect(mapDocenteToFormValues(DETALLE)).toEqual({
      slug: "leo-brouwer",
      titulo: "Maestro",
      aniosExperiencia: 10,
      fraseDestacada: "Frase",
      biografia: "Bio",
      instagram: "@leo",
      linkedin: "",
      youtube: "leo",
      facebook: "",
      instrumentoIds: ["i1", "i2"],
      instrumentoPrincipalId: "i1",
      publicado: true,
      destacado: false,
    })
  })

  it("tolera nulos del detalle", () => {
    const values = mapDocenteToFormValues({
      ...DETALLE,
      titulo: null,
      aniosExperiencia: null,
      fraseDestacada: null,
      biografia: null,
      redesSociales: {},
      instrumentoPrincipalId: null,
    })

    expect(values.titulo).toBe("")
    expect(values.aniosExperiencia).toBeNull()
    expect(values.instrumentoPrincipalId).toBe("")
  })
})

describe("editarDocenteFormSchema", () => {
  it("exige slug y que el principal esté seleccionado", () => {
    expect(
      editarDocenteFormSchema.safeParse({ ...getEditarDocenteFormDefaults(), slug: "" }).success,
    ).toBe(false)

    expect(
      editarDocenteFormSchema.safeParse({
        ...getEditarDocenteFormDefaults(),
        slug: "leo-brouwer",
        instrumentoIds: ["i1"],
        instrumentoPrincipalId: "i2",
      }).success,
    ).toBe(false)
  })

  it("acepta un formulario completo", () => {
    const result = editarDocenteFormSchema.parse(mapDocenteToFormValues(DETALLE))

    expect(result.slug).toBe("leo-brouwer")
    expect(result.aniosExperiencia).toBe(10)
  })
})

describe("buildDocentePatch", () => {
  it("arma el patch con redes y nulos para campos vacíos", () => {
    const patch = buildDocentePatch({
      ...getEditarDocenteFormDefaults(),
      slug: " Leo-Brouwer ",
      instagram: "@leo",
      facebook: " ",
      aniosExperiencia: null,
    })

    expect(patch).toEqual({
      slug: "leo-brouwer",
      titulo_profesional: null,
      biografia: null,
      frase_destacada: null,
      anios_experiencia: null,
      redes_sociales: { instagram: "@leo" },
      publicado: false,
      destacado: false,
    })
  })
})

describe("buildInstrumentosPayload", () => {
  it("envía los instrumentos y el principal", () => {
    expect(
      buildInstrumentosPayload({
        ...getEditarDocenteFormDefaults(),
        instrumentoIds: ["i1"],
        instrumentoPrincipalId: "i1",
      }),
    ).toEqual({ instrumentoIds: ["i1"], instrumentoPrincipalId: "i1" })
  })

  it("deja el principal indefinido si no se eligió", () => {
    expect(buildInstrumentosPayload(getEditarDocenteFormDefaults())).toEqual({
      instrumentoIds: [],
      instrumentoPrincipalId: undefined,
    })
  })
})
