import { describe, expect, it } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getPublicDocentes } from "./getPublicDocentes"

function buildFake() {
  return createFakeSupabase({
    docentes: [
      {
        perfil_id: "p1",
        slug: "kirkiversary12-09",
        titulo_profesional: "Licenciado en Guitarra Acustica",
        biografia: "Bio",
        frase_destacada: "We carry the flame",
        anios_experiencia: 2,
        redes_sociales: {
          instagram: "https://instagram.com/gosmel_arte",
          youtube: "https://youtube.com/@gosmel",
        },
        orden: 0,
        publicado: true,
        perfiles: { nombres: "Charlie", apellidos: "Kirk", avatar_public_id: "gosmel/avatares/abc" },
        docente_instrumento: [
          { es_principal: false, instrumentos: { nombre: "Violín" } },
          { es_principal: true, instrumentos: { nombre: "Guitarra Acustica" } },
          { es_principal: false, instrumentos: { nombre: "Guitarra Clásica" } },
        ],
        docente_formacion: [
          { institucion: "Conservatorio", titulo: "Licenciatura", descripcion: null, orden: 0 },
        ],
        docente_portafolio: [{ tipo: "video", titulo: "Concierto", url_externa: "https://v.com", orden: 0 }],
        docente_reconocimientos: [
          { titulo: "Premio", anio: 2024, entidad_otorgante: "GOSMEL", descripcion: null, orden: 0 },
        ],
      },
      {
        perfil_id: "p2",
        slug: "sin-datos",
        titulo_profesional: null,
        biografia: null,
        frase_destacada: null,
        anios_experiencia: null,
        redes_sociales: {},
        orden: 1,
        publicado: true,
        perfiles: { nombres: "Ada", apellidos: "Lovelace", avatar_public_id: null },
        docente_instrumento: [],
        docente_formacion: [],
        docente_portafolio: [],
        docente_reconocimientos: [],
      },
      {
        perfil_id: "p3",
        slug: "no-publicado",
        titulo_profesional: null,
        biografia: null,
        frase_destacada: null,
        anios_experiencia: null,
        redes_sociales: {},
        orden: 2,
        publicado: false,
        perfiles: { nombres: "Oculto", apellidos: "Perfil", avatar_public_id: null },
        docente_instrumento: [],
        docente_formacion: [],
        docente_portafolio: [],
        docente_reconocimientos: [],
      },
    ],
    testimonios: [
      { docente_id: "p1", autor_nombre: "Alumno Uno", autor_rol: "Estudiante", cita: "Excelente", orden: 0, publicado: true },
      { docente_id: "p1", autor_nombre: "Alumno Dos", autor_rol: null, cita: "Muy bueno", orden: 1, publicado: true },
      { docente_id: "p1", autor_nombre: "Borrador", autor_rol: null, cita: "Oculto", orden: 2, publicado: false },
      { docente_id: "p2", autor_nombre: "Otro", autor_rol: null, cita: "Ajeno", orden: 0, publicado: true },
    ],
  })
}

describe("getPublicDocentes", () => {
  it("solo devuelve docentes publicados", async () => {
    const result = await getPublicDocentes(buildFake())

    expect(result.error).toBeNull()
    expect(result.data!.map((teacher) => teacher.slug)).toEqual(["kirkiversary12-09", "sin-datos"])
  })

  it("mapea la frase destacada y los datos del perfil", async () => {
    const result = await getPublicDocentes(buildFake())
    const teacher = result.data![0]

    expect(teacher.fraseDestacada).toBe("We carry the flame")
    expect(teacher.headline).toBe("Licenciado en Guitarra Acustica")
    expect(teacher.name).toBe("Charlie Kirk")
    expect(teacher.tags).toEqual(["2 años de experiencia"])
    expect(teacher.redesSociales).toEqual({
      instagram: "https://instagram.com/gosmel_arte",
      youtube: "https://youtube.com/@gosmel",
    })
    expect(teacher.education).toEqual([{ title: "Conservatorio", detail: "Licenciatura" }])
    expect(teacher.reconocimientos).toEqual([
      { titulo: "Premio", anio: 2024, entidadOtorgante: "GOSMEL", descripcion: null },
    ])
    expect(teacher.portafolio).toEqual([
      { tipo: "video", titulo: "Concierto", urlExterna: "https://v.com" },
    ])
  })

  it("lista todos los instrumentos con el principal primero", async () => {
    const result = await getPublicDocentes(buildFake())
    const teacher = result.data![0]

    expect(teacher.instrument).toBe("Guitarra Acustica")
    expect(teacher.instruments).toEqual([
      { nombre: "Guitarra Acustica", esPrincipal: true },
      { nombre: "Violín", esPrincipal: false },
      { nombre: "Guitarra Clásica", esPrincipal: false },
    ])
  })

  it("agrupa los testimonios publicados de cada docente", async () => {
    const result = await getPublicDocentes(buildFake())

    expect(result.data![0].studentTestimonials).toEqual([
      { quote: "Excelente", author: "Alumno Uno", role: "Estudiante" },
      { quote: "Muy bueno", author: "Alumno Dos", role: "Alumno" },
    ])
    expect(result.data![1].studentTestimonials).toEqual([
      { quote: "Ajeno", author: "Otro", role: "Alumno" },
    ])
  })

  it("tolera docentes sin datos y sin foto", async () => {
    const result = await getPublicDocentes(buildFake())
    const teacher = result.data![1]

    expect(teacher).toMatchObject({
      instruments: [],
      instrument: "",
      headline: "Profesor de música",
      photo: "",
      photoAlt: "",
      fraseDestacada: null,
      tags: [],
      education: [],
      portafolio: [],
      reconocimientos: [],
    })
  })
})
