function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`)
  }
  return value
}

export const env = {
  supabaseUrl: requireEnv(
    "NEXT_PRODUCTION_SUPABASE_URL (producción) o SUPABASE_URL (staging)",
    process.env.NEXT_PRODUCTION_SUPABASE_URL || process.env.SUPABASE_URL,
  ),
  supabasePublishableKey: requireEnv(
    "NEXT_PRODUCTION_SUPABASE_PUBLISHABLE_KEY (producción) o SUPABASE_PUBLISHABLE_KEY (staging)",
    process.env.NEXT_PRODUCTION_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY,
  ),
  useMockData:
    (process.env.NEXT_PRODUCTION_USE_MOCK_DATA ||
      process.env.USE_MOCK_DATA ||
      process.env.NEXT_PUBLIC_USE_MOCK_DATA) === "true",
}
