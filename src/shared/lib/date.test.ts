import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCurrentYear, parseLocalDate, toDateStringInTimeZone, toLocalDateString } from "./date"

describe("toLocalDateString", () => {
  it("hace padding de mes y día", () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05")
    expect(toLocalDateString(new Date(2026, 11, 31))).toBe("2026-12-31")
  })

  it("acepta una fecha arbitraria sin mutarla", () => {
    const date = new Date(2026, 5, 15)
    expect(toLocalDateString(date)).toBe("2026-06-15")
    expect(date.getFullYear()).toBe(2026)
  })
})

describe("parseLocalDate", () => {
  it("interpreta una fecha sin hora en horario local, sin corrimiento de día", () => {
    const date = parseLocalDate("2026-10-14")

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9)
    expect(date.getDate()).toBe(14)
    expect(date.getHours()).toBe(0)
  })

  it("respeta la hora de un timestamp", () => {
    const date = parseLocalDate("2026-01-15T10:30:00")

    expect(date.getDate()).toBe(15)
    expect(date.getHours()).toBe(10)
    expect(date.getMinutes()).toBe(30)
  })
})

describe("toDateStringInTimeZone", () => {
  it("resuelve la fecha en la zona indicada, no en la del sistema", () => {
    const instante = new Date("2026-09-15T02:00:00Z")

    expect(toDateStringInTimeZone(instante, "UTC")).toBe("2026-09-15")
    expect(toDateStringInTimeZone(instante, "America/Guayaquil")).toBe("2026-09-14")
  })

  it("no corre el día cuando el instante ya avanzó a la madrugada UTC", () => {
    const tarde = new Date("2026-09-15T00:30:00Z")

    expect(toDateStringInTimeZone(tarde, "America/Guayaquil")).toBe("2026-09-14")
  })
})

describe("getCurrentYear", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve el año actual", () => {
    expect(getCurrentYear()).toBe(2026)
  })

  it("toLocalDateString sin argumentos usa la fecha actual", () => {
    expect(toLocalDateString()).toBe("2026-01-05")
  })
})
