import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCurrentYear, toLocalDateString } from "./date"

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
