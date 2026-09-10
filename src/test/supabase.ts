import type {
  IFakeSupabaseOptions,
  TFakeSupabaseClient,
  TFakeSupabaseFactory,
  TFakeRow,
  TFakeTables,
} from "./supabase.types"

type TFakeAction = "select" | "insert" | "update" | "upsert" | "delete"
type TFakeFilterOp = "eq" | "neq" | "in" | "gte" | "lte" | "gt" | "lt" | "is" | "match" | "like"

interface IFakeFilter {
  op: TFakeFilterOp
  column: string
  value: unknown
}

interface IFakeQueryState {
  action: TFakeAction
  payload: TFakeRow | TFakeRow[] | null
  selectRequested: boolean
  selectColumns: string | null
  countRequested: boolean
  headRequested: boolean
  onConflict: string | null
  filters: IFakeFilter[]
  orExpressions: string[]
  orders: Array<{ column: string; ascending: boolean }>
  limitCount: number | null
  range: { from: number; to: number } | null
  single: "single" | "maybeSingle" | null
}

interface IFakeQueryResult {
  data: unknown
  error: { message: string; code?: string } | null
  count: number | null
}

let idCounter = 0

function nextId(): string {
  idCounter += 1
  return `fake-id-${idCounter}`
}

function looseEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a == null || b == null) return a == null && b == null
  return String(a) === String(b)
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b))
}

function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".")
  return new RegExp(`^${escaped}$`, "i")
}

function getValue(row: TFakeRow, column: string): unknown {
  if (!column.includes(".")) return row[column]
  return column.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as TFakeRow)[key]
    return undefined
  }, row)
}

function matchFilter(row: TFakeRow, filter: IFakeFilter): boolean {
  const value = getValue(row, filter.column)

  switch (filter.op) {
    case "eq":
      return looseEquals(value, filter.value)
    case "neq":
      return !looseEquals(value, filter.value)
    case "in":
      return Array.isArray(filter.value) && filter.value.some((item) => looseEquals(value, item))
    case "gte":
      return compareValues(value, filter.value) >= 0
    case "lte":
      return compareValues(value, filter.value) <= 0
    case "gt":
      return compareValues(value, filter.value) > 0
    case "lt":
      return compareValues(value, filter.value) < 0
    case "is":
      if (filter.value === null) return value == null
      return value === filter.value
    case "like":
      return likeToRegExp(String(filter.value)).test(String(value ?? ""))
    case "match": {
      if (typeof filter.value !== "object" || filter.value === null) return false
      return Object.entries(filter.value).every(([key, expected]) => looseEquals(getValue(row, key), expected))
    }
    default:
      return true
  }
}

function matchOrExpression(row: TFakeRow, expression: string): boolean {
  const clauses = expression.split(/,(?![^(]*\))/)

  return clauses.some((clause) => {
    const match = clause.match(/^([^.!]+)\.([a-z]+)\.(.*)$/i)
    if (!match) return false

    const [, column, op, rawValue] = match

    if (op === "in") {
      const values = rawValue.replace(/^\(|\)$/g, "").split(",").filter(Boolean)
      return values.some((item) => looseEquals(getValue(row, column), item))
    }

    if (op === "ilike" || op === "like") return likeToRegExp(rawValue).test(String(getValue(row, column) ?? ""))

    const value = rawValue === "null" ? null : rawValue

    return matchFilter(row, { op: op as TFakeFilterOp, column, value })
  })
}

class FakeQueryBuilder implements PromiseLike<IFakeQueryResult> {
  private readonly state: IFakeQueryState = {
    action: "select",
    payload: null,
    selectRequested: false,
    selectColumns: null,
    countRequested: false,
    headRequested: false,
    onConflict: null,
    filters: [],
    orExpressions: [],
    orders: [],
    limitCount: null,
    range: null,
    single: null,
  }

  constructor(
    private readonly table: string,
    private readonly tables: TFakeTables,
    private readonly errors: Map<string, string>,
    private readonly options: IFakeSupabaseOptions,
  ) {}

  select(...args: unknown[]): this {
    this.state.selectRequested = true
    if (typeof args[0] === "string") this.state.selectColumns = args[0]
    const options = args[1] as { count?: string; head?: boolean } | undefined
    if (options?.count) this.state.countRequested = true
    if (options?.head) this.state.headRequested = true
    return this
  }

  insert(payload: TFakeRow | TFakeRow[]): this {
    this.state.action = "insert"
    this.state.payload = payload
    return this
  }

  update(payload: TFakeRow): this {
    this.state.action = "update"
    this.state.payload = payload
    return this
  }

  upsert(payload: TFakeRow | TFakeRow[], options?: { onConflict?: string }): this {
    this.state.action = "upsert"
    this.state.payload = payload
    this.state.onConflict = options?.onConflict ?? null
    return this
  }

  delete(): this {
    this.state.action = "delete"
    return this
  }

  eq(column: string, value: unknown): this {
    this.state.filters.push({ op: "eq", column, value })
    return this
  }

  neq(column: string, value: unknown): this {
    this.state.filters.push({ op: "neq", column, value })
    return this
  }

  in(column: string, value: unknown[]): this {
    this.state.filters.push({ op: "in", column, value })
    return this
  }

  gte(column: string, value: unknown): this {
    this.state.filters.push({ op: "gte", column, value })
    return this
  }

  lte(column: string, value: unknown): this {
    this.state.filters.push({ op: "lte", column, value })
    return this
  }

  gt(column: string, value: unknown): this {
    this.state.filters.push({ op: "gt", column, value })
    return this
  }

  lt(column: string, value: unknown): this {
    this.state.filters.push({ op: "lt", column, value })
    return this
  }

  is(column: string, value: unknown): this {
    this.state.filters.push({ op: "is", column, value })
    return this
  }

  ilike(column: string, pattern: string): this {
    this.state.filters.push({ op: "like", column, value: pattern })
    return this
  }

  like(column: string, pattern: string): this {
    this.state.filters.push({ op: "like", column, value: pattern })
    return this
  }

  match(value: TFakeRow): this {
    this.state.filters.push({ op: "match", column: "", value })
    return this
  }

  or(expression: string): this {
    this.state.orExpressions.push(expression)
    return this
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.state.orders.push({ column, ascending: options?.ascending ?? true })
    return this
  }

  limit(count: number): this {
    this.state.limitCount = count
    return this
  }

  range(from: number, to: number): this {
    this.state.range = { from, to }
    return this
  }

  single(): this {
    this.state.single = "single"
    return this
  }

  maybeSingle(): this {
    this.state.single = "maybeSingle"
    return this
  }

  then<TResult1 = IFakeQueryResult, TResult2 = never>(
    onfulfilled?: ((value: IFakeQueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }

  private rows(): TFakeRow[] {
    this.tables[this.table] ??= []
    return this.tables[this.table]
  }

  private filtered(rows: TFakeRow[]): TFakeRow[] {
    return rows.filter(
      (row) =>
        this.state.filters.every((filter) => matchFilter(row, filter)) &&
        this.state.orExpressions.every((expression) => matchOrExpression(row, expression)),
    )
  }

  private sorted(rows: TFakeRow[]): TFakeRow[] {
    if (this.state.orders.length === 0) return rows

    return [...rows].sort((a, b) => {
      for (const { column, ascending } of this.state.orders) {
        const result = compareValues(a[column], b[column])
        if (result !== 0) return ascending ? result : -result
      }
      return 0
    })
  }

  private windowed(rows: TFakeRow[]): TFakeRow[] {
    let result = rows
    if (this.state.range) result = result.slice(this.state.range.from, this.state.range.to + 1)
    if (this.state.limitCount != null) result = result.slice(0, this.state.limitCount)
    return result
  }

  private finishSelect(rows: TFakeRow[]): IFakeQueryResult {
    if (this.state.countRequested) {
      return { data: this.state.headRequested ? null : rows, error: null, count: rows.length }
    }

    if (this.state.single === "single") {
      if (rows.length !== 1) {
        return {
          data: null,
          error: { message: rows.length === 0 ? "The result contains 0 rows" : "The result contains multiple rows" },
          count: null,
        }
      }
      return { data: rows[0], error: null, count: null }
    }

    if (this.state.single === "maybeSingle") {
      if (rows.length > 1) {
        return { data: null, error: { message: "The result contains multiple rows" }, count: null }
      }
      return { data: rows[0] ?? null, error: null, count: null }
    }

    return { data: rows, error: null, count: null }
  }

  private projected(rows: TFakeRow[]): TFakeRow[] {
    const columns = this.state.selectColumns
    if (!columns || columns.includes("*")) return rows

    const keys = columns
      .split(",")
      .map((token) => token.trim().split(":").pop()!.split("(")[0].split("!")[0].trim())
      .filter(Boolean)

    return rows.map((row) => {
      const projected: TFakeRow = {}
      for (const key of keys) {
        if (key in row) projected[key] = row[key]
      }
      return projected
    })
  }

  private finishMutation(rows: TFakeRow[]): IFakeQueryResult {
    if (!this.state.selectRequested) return { data: null, error: null, count: null }
    return this.finishSelect(this.projected(rows))
  }

  private async execute(): Promise<IFakeQueryResult> {
    const actionError = this.options.operationErrors?.[`${this.table}:${this.state.action}`]
    const error = actionError ?? this.errors.get(this.table)
    if (error) {
      return {
        data: null,
        error: { message: error, code: this.options.errorCodes?.[this.table] },
        count: null,
      }
    }

    const rows = this.rows()

    if (this.state.action === "select") {
      return this.finishSelect(this.projected(this.windowed(this.sorted(this.filtered(rows)))))
    }

    if (this.state.action === "insert") {
      const records = Array.isArray(this.state.payload) ? this.state.payload : [this.state.payload ?? {}]
      const created = records.map((record) => ({ id: record.id ?? nextId(), ...record }))
      rows.push(...created)
      return this.finishMutation(created)
    }

    if (this.state.action === "update") {
      const matched = this.filtered(rows)
      for (const row of matched) Object.assign(row, this.state.payload)
      return this.finishMutation(matched)
    }

    if (this.state.action === "upsert") {
      const records = Array.isArray(this.state.payload) ? this.state.payload : [this.state.payload ?? {}]
      const keys = this.state.onConflict?.split(",").map((key) => key.trim()) ?? ["id"]
      const created: TFakeRow[] = []

      for (const record of records) {
        const existing = rows.find((row) => keys.every((key) => looseEquals(row[key], record[key])))
        if (existing) {
          Object.assign(existing, record)
          created.push(existing)
        } else {
          const inserted = { id: record.id ?? nextId(), ...record }
          rows.push(inserted)
          created.push(inserted)
        }
      }

      return this.finishMutation(created)
    }

    const matched = this.filtered(rows)
    for (const row of matched) rows.splice(rows.indexOf(row), 1)
    return this.finishMutation(matched)
  }
}

function buildAuth(options: IFakeSupabaseOptions) {
  return {
    getClaims: async () => {
      if (options.claimsError) return { data: null, error: { message: options.claimsError } }
      if (!options.claims) return { data: null, error: null }
      return { data: { claims: options.claims }, error: null }
    },
    getUser: async () => {
      if (options.userError) return { data: { user: null }, error: { message: options.userError } }
      return { data: { user: options.user ?? null }, error: null }
    },
  }
}

function buildClient(
  tables: TFakeTables,
  errors: Map<string, string>,
  options: IFakeSupabaseOptions,
): TFakeSupabaseClient {
  const client = {
    from: (table: string) => new FakeQueryBuilder(table, tables, errors, options),
    rpc: async (_fn: string, args?: unknown) => {
      const fnError = errors.get(`rpc:${_fn}`) ?? options.rpcError
      if (fnError) {
        return { data: null, error: { message: fnError, code: options.rpcErrorCode } }
      }

      const handler = options.rpcResults?.[_fn]
      const result = typeof handler === "function" ? (handler as (a: unknown) => unknown)(args) : (handler ?? null)
      return { data: result, error: null }
    },
    auth: buildAuth(options),
  }

  return client as unknown as TFakeSupabaseClient
}

export const createFakeSupabase = ((
  tables: TFakeTables = {},
  options: IFakeSupabaseOptions = {},
) => buildClient(tables, new Map(), options)) as TFakeSupabaseFactory

createFakeSupabase.withError = (
  table: string,
  message: string,
  tables: TFakeTables = {},
  options: IFakeSupabaseOptions = {},
) => buildClient(tables, new Map([[table, message]]), options)

export type { IFakeClaims } from "./supabase.types"
