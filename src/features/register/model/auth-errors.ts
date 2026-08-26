const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: "Ya existe una cuenta con este correo. Inicia sesión.",
  email_exists: "Ya existe una cuenta con este correo. Inicia sesión.",
  weak_password: "La contraseña es muy débil. Usa al menos 8 caracteres.",
  over_request_rate_limit: "Demasiados intentos. Espera un momento.",
  signup_disabled: "El registro está deshabilitado por el momento.",
  invalid_request: "Los datos enviados no son válidos. Revisa el formulario.",
  unknown_error: "No pudimos crear tu cuenta. Intenta de nuevo.",
}

export function getRegisterErrorMessage(code: string): string {
  return REGISTER_ERROR_MESSAGES[code] ?? REGISTER_ERROR_MESSAGES.unknown_error
}