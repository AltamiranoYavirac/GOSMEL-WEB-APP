import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  generarCuotasFormSchema,
  getGenerarCuotasFormDefaults,
  getMonthOptions,
} from "./GenerarCuotasForm.config"

describe("generarCuotasFormSchema", () => {
  it("exige un mes", () => {
    expect(generarCuotasFormSchema.safeParse({ mes: "" }).success).toBe(false)
    expect(generarCuotasFormSchema.safeParse({ mes: "2026-06" }).success).toBe(true)
  })
})

describe("getGenerarCuotasFormDefaults", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve el mes actual", () => {
    expect(getGenerarCuotasFormDefaults()).toEqual({ mes: "2026-06" })
  })
})

describe("getMonthOptions", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("genera 2 meses previos + mes actual + 6 siguientes", () => {
    const options = getMonthOptions()

    expect(options).toHaveLength(9)
    expect(options[0].value).toBe("2026-04")
    expect(options[2].value).toBe("2026-06")
    expect(options[8].value).toBe("2026-12")
  })

  it("hace rollover de año hacia atrás", () => {
    vi.setSystemTime(new Date(2026, 0, 10))

    const options = getMonthOptions()

    expect(options[0].value).toBe("2025-11")
    expect(options[2].value).toBe("2026-01")
  })

  it("incluye labels legibles", () => {
    expect(getMonthOptions()[2].label).toContain("2026")
  })
})
