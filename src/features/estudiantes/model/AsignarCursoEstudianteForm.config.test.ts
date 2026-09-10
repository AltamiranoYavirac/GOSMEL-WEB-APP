import { describe, expect, it } from "vitest"

import {
  asignarCursoEstudianteFormSchema,
  buildAsignarCursoEstudiantePayload,
  getAsignarCursoEstudianteFormDefaults,
} from "./AsignarCursoEstudianteForm.config"

describe("asignarCursoEstudianteFormSchema", () => {
  it("rechaza estudiante, cátedra y monto inválidos", () => {
    const result = asignarCursoEstudianteFormSchema.safeParse({
      estudianteId: "",
      catedraId: "",
      montoMensual: 0,
      diaCobro: "8",
    })

    expect(result.success).toBe(false)
  })

  it("coerciona el monto y acepta un payload válido", () => {
    const result = asignarCursoEstudianteFormSchema.parse({
      estudianteId: "e1",
      catedraId: "c1",
      montoMensual: "50",
      diaCobro: "10",
      motivoAjuste: " beca ",
    })

    expect(result.montoMensual).toBe(50)
    expect(result.diaCobro).toBe("10")
  })
})

describe("getAsignarCursoEstudianteFormDefaults", () => {
  it("usa el estudiante provisto y defaults de cobro", () => {
    expect(getAsignarCursoEstudianteFormDefaults("e1")).toEqual({
      estudianteId: "e1",
      catedraId: "",
      montoMensual: 45,
      diaCobro: "5",
      motivoAjuste: "",
    })
  })

  it("cae a vacío sin estudiante", () => {
    expect(getAsignarCursoEstudianteFormDefaults().estudianteId).toBe("")
  })
})

describe("buildAsignarCursoEstudiantePayload", () => {
  it("convierte diaCobro a número y recorta motivo", () => {
    const payload = buildAsignarCursoEstudiantePayload({
      estudianteId: "e1",
      catedraId: "c1",
      montoMensual: 45,
      diaCobro: "15",
      motivoAjuste: "  ajuste  ",
    })

    expect(payload).toEqual({
      estudianteId: "e1",
      catedraId: "c1",
      montoMensual: 45,
      diaCobro: 15,
      motivoAjuste: "ajuste",
    })
  })

  it("omite motivo vacío", () => {
    const payload = buildAsignarCursoEstudiantePayload({
      estudianteId: "e1",
      catedraId: "c1",
      montoMensual: 45,
      diaCobro: "1",
      motivoAjuste: "   ",
    })

    expect(payload.motivoAjuste).toBeUndefined()
  })
})
