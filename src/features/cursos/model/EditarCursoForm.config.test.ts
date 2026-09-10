import { describe, expect, it } from "vitest"

import type { ICursoDetalle } from "./curso.types"
import {
  buildEditarCursoPayload,
  editarCursoFormSchema,
  mapCursoDetalleToFormValues,
} from "./EditarCursoForm.config"

function buildDetalle(overrides: Partial<ICursoDetalle> = {}): ICursoDetalle {
  return {
    id: "c1",
    nombre: "Guitarra Clásica",
    resumen: "Resumen",
    descripcion: "Descripción",
    nivel: "intermedio",
    modalidad: "presencial",
    duracionSemanas: "12",
    horasTotales: "24",
    precioReferencial: "45",
    etiquetaPrecio: "Mensual",
    mostrarPrecio: true,
    videoIntroUrl: "https://video.example.com/x",
    portadaPublicId: "cursos/portada",
    publicado: true,
    destacado: false,
    ...overrides,
  }
}

describe("editarCursoFormSchema", () => {
  it("rechaza nombre, descripción y URL inválidos", () => {
    expect(
      editarCursoFormSchema.safeParse({
        nombre: "",
        descripcion: "",
        nivel: "iniciacion",
        modalidad: "virtual",
        mostrarPrecio: true,
        publicado: true,
        destacado: false,
      }).success,
    ).toBe(false)

    expect(
      editarCursoFormSchema.safeParse({
        nombre: "Curso",
        descripcion: "Desc",
        nivel: "iniciacion",
        modalidad: "virtual",
        videoIntroUrl: "no-es-url",
        mostrarPrecio: true,
        publicado: true,
        destacado: false,
      }).success,
    ).toBe(false)
  })

  it("acepta URL vacía o válida", () => {
    const base = {
      nombre: "Curso",
      descripcion: "Desc",
      nivel: "iniciacion" as const,
      modalidad: "virtual" as const,
      mostrarPrecio: true,
      publicado: true,
      destacado: false,
    }

    expect(editarCursoFormSchema.safeParse({ ...base, videoIntroUrl: "" }).success).toBe(true)
    expect(editarCursoFormSchema.safeParse({ ...base, videoIntroUrl: "https://ok.com" }).success).toBe(true)
  })
})

describe("mapCursoDetalleToFormValues", () => {
  it("convierte strings numéricos y conserva el resto", () => {
    const values = mapCursoDetalleToFormValues(buildDetalle())

    expect(values.duracionSemanas).toBe(12)
    expect(values.horasTotales).toBe(24)
    expect(values.precioReferencial).toBe(45)
    expect(values.videoIntroUrl).toBe("https://video.example.com/x")
  })

  it("convierte vacíos numéricos a null", () => {
    const values = mapCursoDetalleToFormValues(
      buildDetalle({ duracionSemanas: "", horasTotales: "", precioReferencial: "" }),
    )

    expect(values.duracionSemanas).toBeNull()
    expect(values.horasTotales).toBeNull()
    expect(values.precioReferencial).toBeNull()
  })
})

describe("buildEditarCursoPayload", () => {
  it("hace round-trip sin perder campos", () => {
    const values = mapCursoDetalleToFormValues(buildDetalle())
    const payload = buildEditarCursoPayload(values)

    expect(payload).toEqual({
      nombre: "Guitarra Clásica",
      resumen: "Resumen",
      descripcion: "Descripción",
      nivel: "intermedio",
      modalidad: "presencial",
      duracion_semanas: 12,
      horas_totales: 24,
      precio_referencial: 45,
      etiqueta_precio: "Mensual",
      mostrar_precio: true,
      video_intro_url: "https://video.example.com/x",
      portada_public_id: "cursos/portada",
      publicado: true,
      destacado: false,
    })
  })

  it("normaliza vacíos a null y recorta strings", () => {
    const payload = buildEditarCursoPayload({
      nombre: " Curso ",
      resumen: "  ",
      descripcion: "Desc",
      nivel: "basico",
      modalidad: "hibrido",
      duracionSemanas: null,
      horasTotales: undefined,
      precioReferencial: null,
      etiquetaPrecio: "  ",
      mostrarPrecio: false,
      videoIntroUrl: "  ",
      portadaPublicId: "",
      publicado: false,
      destacado: true,
    })

    expect(payload.nombre).toBe(" Curso ")
    expect(payload.resumen).toBeNull()
    expect(payload.duracion_semanas).toBeNull()
    expect(payload.horas_totales).toBeNull()
    expect(payload.etiqueta_precio).toBeNull()
    expect(payload.video_intro_url).toBeNull()
    expect(payload.portada_public_id).toBeNull()
  })
})
