import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/shared/api/supabase/database.types"

export type TFakeRow = Record<string, unknown>
export type TFakeTables = Record<string, TFakeRow[]>
export type TFakeSupabaseClient = SupabaseClient<Database>

export interface IFakeClaims {
  sub?: string
  email?: string
  [key: string]: unknown
}

export interface IFakeSupabaseOptions {
  claims?: IFakeClaims | null
  claimsError?: string
  user?: IFakeClaims | null
  userError?: string
  rpcResults?: Record<string, unknown>
  rpcError?: string
  rpcErrorCode?: string
  errorCodes?: Record<string, string>
  operationErrors?: Record<string, string>
}

export type TFakeSupabaseFactory = ((
  tables?: TFakeTables,
  options?: IFakeSupabaseOptions,
) => TFakeSupabaseClient) & {
  withError: (
    table: string,
    message: string,
    tables?: TFakeTables,
    options?: IFakeSupabaseOptions,
  ) => TFakeSupabaseClient
}
