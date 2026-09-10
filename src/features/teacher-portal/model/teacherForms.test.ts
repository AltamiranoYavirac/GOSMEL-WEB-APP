import { describe, expect, it } from "vitest"

import { teacherEvaluacionFormSchema } from "./TeacherEvaluacionForm.config"
import { teacherFormacionFormSchema } from "./TeacherFormacionForm.config"
import { teacherMaterialFormSchema } from "./TeacherMaterialForm.config"
import { teacherPerfilFormSchema, mapTeacherPerfilToFormValues } from "./TeacherPerfilForm.config"
import { teacherPortafolioFormSchema } from "./TeacherPortafolioForm.config"
import { teacherReconocimientoFormSchema } from "./TeacherReconocimientoForm.config"
import { teacherSesionFormSchema } from "./TeacherSesionForm.config"

describe("teacherEvaluacionFormSchema", () => {
  it("valida campos y rangos", () => {
    const base = { catedraId: "c1", titulo: "Parcial", tipo: "sumativa", fecha: "2026-06-01", notaMaxima: 10, ponderacion: 30 }

    expect(teacherEvaluacionFormSchema.safeParse(base).success).toBe(true)
    expect(teacherEvaluacionFormSchema.safeParse({ ...base, titulo: "ab" }).success).toBe(false)
    expect(teacherEvaluacionFormSchema.safeParse({ ...base, notaMaxima: 0 }).success).toBe(false)
    expect(teacherEvaluacionFormSchema.safeParse({ ...base, ponderacion: 101 }).success).toBe(false)
    expect(teacherEvaluacionFormSchema.safeParse({ ...base, descripcion: "x".repeat(501) }).success).toBe(false)
  })
})

describe("teacherSesionFormSchema", () => {
  it("exige cátedra, fecha y horas", () => {
    const base = { catedraId: "c1", fecha: "2026-06-01", horaInicio: "15:00", horaFin: "16:00" }

    expect(teacherSesionFormSchema.safeParse(base).success).toBe(true)
    expect(teacherSesionFormSchema.safeParse({ ...base, catedraId: "" }).success).toBe(false)
    expect(teacherSesionFormSchema.safeParse({ ...base, tema: "x".repeat(201) }).success).toBe(false)
  })
})

describe("teacherFormacionFormSchema", () => {
  it("valida años y requeridos", () => {
    const base = { institucion: "Conservatorio", titulo: "Título", anioInicio: 2000, anioFin: 2005, descripcion: "" }

    expect(teacherFormacionFormSchema.safeParse(base).success).toBe(true)
    expect(teacherFormacionFormSchema.safeParse({ ...base, institucion: "X" }).success).toBe(false)
    expect(teacherFormacionFormSchema.safeParse({ ...base, anioInicio: 1900 }).success).toBe(false)
    expect(teacherFormacionFormSchema.safeParse({ ...base, anioFin: 2050 }).success).toBe(false)
  })
})

describe("teacherMaterialFormSchema", () => {
  it("valida URL y enums", () => {
    const base = { catedraId: "c1", titulo: "Partitura", tipo: "pdf", visibilidad: "inscritos", urlExterna: "", storagePath: "" }

    expect(teacherMaterialFormSchema.safeParse(base).success).toBe(true)
    expect(teacherMaterialFormSchema.safeParse({ ...base, urlExterna: "https://ok.com/a.pdf" }).success).toBe(true)
    expect(teacherMaterialFormSchema.safeParse({ ...base, urlExterna: "no-url" }).success).toBe(false)
    expect(teacherMaterialFormSchema.safeParse({ ...base, tipo: "zip" }).success).toBe(false)
    expect(teacherMaterialFormSchema.safeParse({ ...base, visibilidad: "todos" }).success).toBe(false)
  })
})

describe("teacherPortafolioFormSchema", () => {
  it("exige URL válida y título", () => {
    expect(teacherPortafolioFormSchema.safeParse({ titulo: "Video", tipo: "video", urlExterna: "https://v.com" }).success).toBe(true)
    expect(teacherPortafolioFormSchema.safeParse({ titulo: "V", tipo: "video", urlExterna: "https://v.com" }).success).toBe(false)
    expect(teacherPortafolioFormSchema.safeParse({ titulo: "Video", tipo: "video", urlExterna: "nope" }).success).toBe(false)
    expect(teacherPortafolioFormSchema.safeParse({ titulo: "Video", tipo: "otro", urlExterna: "https://v.com" }).success).toBe(false)
  })
})

describe("teacherReconocimientoFormSchema", () => {
  it("valida año y límites de texto", () => {
    const base = { titulo: "Premio", anio: 2020, entidadOtorgante: "", descripcion: "" }

    expect(teacherReconocimientoFormSchema.safeParse(base).success).toBe(true)
    expect(teacherReconocimientoFormSchema.safeParse({ ...base, titulo: "P" }).success).toBe(false)
    expect(teacherReconocimientoFormSchema.safeParse({ ...base, anio: 1800 }).success).toBe(false)
    expect(teacherReconocimientoFormSchema.safeParse({ ...base, entidadOtorgante: "x".repeat(151) }).success).toBe(false)
  })
})

describe("teacherPerfilFormSchema", () => {
  it("acepta campos vacíos y mapea desde el detalle", () => {
    const defaults = {
      tituloProfesional: "",
      biografia: "",
      fraseDestacada: "",
      aniosExperiencia: 0,
      instagram: "",
      linkedin: "",
      youtube: "",
      facebook: "",
    }

    expect(teacherPerfilFormSchema.safeParse(defaults).success).toBe(true)
    expect(teacherPerfilFormSchema.safeParse({ ...defaults, aniosExperiencia: 71 }).success).toBe(false)
    expect(teacherPerfilFormSchema.safeParse({ ...defaults, biografia: "x".repeat(2001) }).success).toBe(false)

    expect(
      mapTeacherPerfilToFormValues({
        tituloProfesional: null,
        biografia: null,
        fraseDestacada: null,
        aniosExperiencia: null,
        redesSociales: { instagram: "@x" },
      }),
    ).toMatchObject({ tituloProfesional: "", aniosExperiencia: 0, instagram: "@x", linkedin: "" })
  })
})
