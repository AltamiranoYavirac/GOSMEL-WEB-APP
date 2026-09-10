import { describe, expect, it } from "vitest"

import { getAuthErrorMessage } from "./auth-errors"

describe("getAuthErrorMessage", () => {
  it("traduce códigos conocidos", () => {
    expect(getAuthErrorMessage("invalid_credentials")).toBe("Correo o contraseña incorrectos.")
    expect(getAuthErrorMessage("email_not_confirmed")).toBe("Debes confirmar tu correo antes de entrar.")
    expect(getAuthErrorMessage("account_inactive")).toContain("desactivada")
    expect(getAuthErrorMessage("over_request_rate_limit")).toContain("Demasiados intentos")
  })

  it("devuelve mensaje genérico para códigos desconocidos", () => {
    expect(getAuthErrorMessage("whatever")).toBe("No pudimos iniciar sesión. Intenta de nuevo.")
    expect(getAuthErrorMessage("")).toBe("No pudimos iniciar sesión. Intenta de nuevo.")
  })
})
