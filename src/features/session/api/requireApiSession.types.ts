import type { NextResponse } from "next/server"

import type { ISessionUser, TRol } from "@/entities/user"

export interface IApiSessionSuccess {
  ok: true
  session: ISessionUser
}

export interface IApiSessionFailure {
  ok: false
  response: NextResponse
}

export type TApiSessionResult = IApiSessionSuccess | IApiSessionFailure

export type TRequireApiSession = (allowed?: TRol[]) => Promise<TApiSessionResult>
