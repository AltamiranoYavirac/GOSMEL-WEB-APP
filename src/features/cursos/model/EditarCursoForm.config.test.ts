import { describe, expect, it } from "vitest"

import type { ICursoDetalle } from "./curso.types"
import {
  buildEditarCursoPayload,
  editarCursoFormSchema,
  getEditarCursoFormDefaults,
  mapCursoDetalleToFormValues,
} from "./EditarCursoForm.config"

function buildDetalle(overrides: Partial<ICursoDetalle> = {}): ICursoDetalle {
  return {
    id: "c1",
    nombre: "Guitarra Clásica",
    resumen: "Resumen",
    descripcion: "Descripción",
    instrumentoId: "i1",
    categoria: "instrumento",
    nivel: "intermedio",
    modalidad: "presencial",
    orden: 3,
    duracionSemanas: "12",
    horasTotales: "24",
    precioReferencial: "45",
    etiquetaPrecio: "Mensual",
    mostrarPrecio: true,
    portadaPublicId: "gosmel/cursos/portada",
    portadaTextoAlt: "Portada de guitarra",
    publicoEdad: "Todas las edades",
    publicoNivel: "Todos los niveles",
    formatoClase: "Individual",
    horarioResumen: "Lunes a sábado",
    cierreEtapa: "Recital",
    ctaTitulo: "Aprende guitarra",
    ctaDescripcion: "Reserva una clase",
    ctaPrimarioTexto: "Reservar",
    ctaSecundarioTexto: "Ver cursos",
    publicado: true,
    ...overrides,
  }
}

describe("editarCursoFormSchema", () => {
  it("rechaza nombre y descripción inválidos", () => {
    const values = getEditarCursoFormDefaults()
    expect(editarCursoFormSchema.safeParse({ ...values, nombre: "", descripcion: "" }).success).toBe(false)
  })

  it("acepta un borrador válido", () => {
    const values = getEditarCursoFormDefaults()
    expect(editarCursoFormSchema.safeParse({ ...values, nombre: "Curso", descripcion: "Desc" }).success).toBe(true)
  })

  it("exige instrumento cuando la categoría es instrumento", () => {
    const result = editarCursoFormSchema.safeParse({
      ...getEditarCursoFormDefaults(),
      nombre: "Curso",
      descripcion: "Descripción",
      categoria: "instrumento",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "instrumentoId")).toBe(true)
    }
  })

  it("exige precio y etiqueta cuando mostrarPrecio está activo", () => {
    const result = editarCursoFormSchema.safeParse({
      ...getEditarCursoFormDefaults(),
      nombre: "Curso",
      descripcion: "Descripción",
      mostrarPrecio: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "precioReferencial")).toBe(true)
      expect(result.error.issues.some((issue) => issue.path[0] === "etiquetaPrecio")).toBe(true)
    }
  })
})

describe("mapCursoDetalleToFormValues", () => {
  it("convierte strings numéricos y conserva el contenido público", () => {
    const values = mapCursoDetalleToFormValues(buildDetalle())
    expect(values.duracionSemanas).toBe(12)
    expect(values.horasTotales).toBe(24)
    expect(values.precioReferencial).toBe(45)
    expect(values.orden).toBe(3)
    expect(values.portadaTextoAlt).toBe("Portada de guitarra")
  })
})

describe("buildEditarCursoPayload", () => {
  it("hace round-trip de los campos públicos", () => {
    const payload = buildEditarCursoPayload(mapCursoDetalleToFormValues(buildDetalle()))
    expect(payload).toMatchObject({
      nombre: "Guitarra Clásica",
      instrumento_id: "i1",
      categoria: "instrumento",
      orden: 3,
      portada_public_id: "gosmel/cursos/portada",
      portada_texto_alt: "Portada de guitarra",
      publico_edad: "Todas las edades",
      cta_titulo: "Aprende guitarra",
    })
    expect(payload).not.toHaveProperty("destacado")
  })

  it("guarda null en duracion_semanas cuando el curso es permanente", () => {
    const values = mapCursoDetalleToFormValues(buildDetalle())
    const payload = buildEditarCursoPayload({ ...values, duracionPermanente: true, duracionSemanas: 12 })
    expect(payload.duracion_semanas).toBeNull()
    expect(payload.horas_totales).toBeNull()
  })

  it("marca permanente cuando el detalle no tiene duración", () => {
    const values = mapCursoDetalleToFormValues(buildDetalle({ duracionSemanas: "" }))
    expect(values.duracionPermanente).toBe(true)
  })

  it("normaliza vacíos a null", () => {
    const values = getEditarCursoFormDefaults()
    const payload = buildEditarCursoPayload({ ...values, nombre: "Curso", descripcion: "Desc" })
    expect(payload.resumen).toBeNull()
    expect(payload.duracion_semanas).toBeNull()
    expect(payload.etiqueta_precio).toBeNull()
    expect(payload.portada_public_id).toBeNull()
  })
})
