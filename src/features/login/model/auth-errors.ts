const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  email_not_confirmed: "Debes confirmar tu correo antes de entrar.",
  account_inactive: "Tu cuenta está desactivada. Contacta a la academia para solicitar acceso.",
  sin_rol:
    "Tu cuenta aún no ha sido inscrita o no tiene un curso activo en la academia. Contacta a la academia para completar tu registro.",
  over_request_rate_limit: "Demasiados intentos. Espera un momento.",
  unknown_error: "No pudimos iniciar sesión. Intenta de nuevo.",
}

export function getAuthErrorMessage(code: string): string {
  return AUTH_ERROR_MESSAGES[code] ?? "No pudimos iniciar sesión. Intenta de nuevo."
}
