import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  calculateAge,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDateTimeShort,
  formatMonthPeriod,
  formatTimeAgo,
  initialsOf,
} from "./formatters"

describe("formatCurrency", () => {
  it("formatea un número en USD", () => {
    expect(formatCurrency(12345.5)).toContain("12.345")
  })

  it("trata null y undefined como 0", () => {
    expect(formatCurrency(null)).toBe(formatCurrency(0))
    expect(formatCurrency(undefined)).toBe(formatCurrency(0))
  })
})

describe("formatDate / formatDateTime / formatDateTimeShort", () => {
  it("devuelve el placeholder para valores vacíos", () => {
    expect(formatDate(null)).toBe("—")
    expect(formatDate(undefined)).toBe("—")
    expect(formatDateTime(null)).toBe("—")
    expect(formatDateTimeShort(null)).toBe("—")
  })

  it("formatea fechas ISO", () => {
    expect(formatDate("2026-01-15T10:30:00")).toContain("2026")
    expect(formatDate("2026-01-15T10:30:00")).toContain("15")
    expect(formatDateTime("2026-01-15T10:30:00")).toContain("10:30")
    expect(formatDateTimeShort("2026-01-15T10:30:00")).toContain("10:30")
  })
})

describe("formatMonthPeriod", () => {
  it("formatea un periodo válido", () => {
    expect(formatMonthPeriod("2026-03")).toContain("2026")
    expect(formatMonthPeriod("2026-03")).toContain("marzo")
  })

  it("devuelve el input cuando no es un periodo parseable", () => {
    expect(formatMonthPeriod("basura")).toBe("basura")
    expect(formatMonthPeriod("")).toBe("")
  })

  it("hace rollover de meses fuera de rango (documenta el comportamiento actual)", () => {
    expect(formatMonthPeriod("2026-13")).toContain("2027")
  })
})

describe("initialsOf", () => {
  it("devuelve ? para un string vacío", () => {
    expect(initialsOf("")).toBe("?")
    expect(initialsOf("   ")).toBe("?")
  })

  it("devuelve dos letras para un solo nombre", () => {
    expect(initialsOf("Ada")).toBe("AD")
  })

  it("toma primera y última inicial ignorando espacios extra", () => {
    expect(initialsOf(" Ada Byron King ")).toBe("AK")
    expect(initialsOf("ada byron king")).toBe("AK")
  })
})

describe("formatTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve el placeholder para valores vacíos", () => {
    expect(formatTimeAgo(null)).toBe("—")
    expect(formatTimeAgo(undefined)).toBe("—")
  })

  it("usa 'hace un momento' para menos de un minuto", () => {
    expect(formatTimeAgo("2026-06-15T11:59:30")).toBe("hace un momento")
  })

  it("formatea minutos, horas y días", () => {
    expect(formatTimeAgo("2026-06-15T11:55:00")).toBe("hace 5 minutos")
    expect(formatTimeAgo("2026-06-15T09:00:00")).toBe("hace 3 horas")
    expect(formatTimeAgo("2026-06-13T12:00:00")).toBe("hace 2 días")
  })

  it("formatea semanas, meses y años", () => {
    expect(formatTimeAgo("2026-06-01T12:00:00")).toBe("hace 2 semanas")
    expect(formatTimeAgo("2026-01-15T12:00:00")).toBe("hace 5 meses")
    expect(formatTimeAgo("2024-06-15T12:00:00")).toBe("hace 2 años")
  })
})

describe("calculateAge", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve null sin fecha", () => {
    expect(calculateAge(null)).toBeNull()
    expect(calculateAge(undefined)).toBeNull()
  })

  it("devuelve la edad exacta el día del cumpleaños", () => {
    expect(calculateAge("2000-06-15")).toBe(26)
  })

  it("resta un año si aún no cumplió", () => {
    expect(calculateAge("2000-06-16T12:00:00")).toBe(25)
    expect(calculateAge("2000-12-01")).toBe(25)
  })
})
