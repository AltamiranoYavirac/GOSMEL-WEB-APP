---
name: gosmel-fsd-api
description: >-
  Patrón para escribir funciones del segmento api/ de un slice FSD en
  GOSMEL-WEB-APP: llamadas a Supabase (browser o server client), contrato
  { data, error } sin throw, y mapeo de snake_case (columnas DB) a camelCase
  (dominio). Usar SIEMPRE al crear o modificar archivos dentro de
  features/{slice}/api/ o entities/{slice}/api/, o cuando se necesite
  consultar/mutar una tabla de Supabase desde el frontend.
---

# GOSMEL FSD — Segmento api/

Las funciones de `api/` son el único lugar del frontend que habla
directamente con Supabase. Todo lo demás (hooks, componentes) pasa por
ellas — nunca instancian un cliente Supabase por su cuenta.

## Contrato de retorno — obligatorio

Toda función de `api/` retorna `{ data, error }`. **Nunca hace `throw`.**
El `throw` ocurre un nivel arriba, en el hook de `hooks/` (ver skill
`gosmel-fsd-hooks`), porque TanStack Query necesita un `throw` dentro de
`queryFn`/`mutationFn` para marcar el estado de error — pero `api/` en sí
se mantiene silenciosa y predecible.

```typescript
interface IGetCursosResult {
  data: ICourseListItem[] | null
  error: string | null
}

export async function getCursos(): Promise<IGetCursosResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.from("cursos").select("...")

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: /* mapeado */, error: null }
}
```

## Qué cliente Supabase usar

| Cliente | Import | Cuándo |
|---|---|---|
| Browser | `createSupabaseBrowserClient` de `@/shared/api/supabase/client` | Funciones llamadas desde hooks `"use client"` (mutations de formularios, listados interactivos) |
| Server | `createSupabaseServerClient` de `@/shared/api/supabase/server` (es `async`, requiere `await`) | Funciones llamadas desde Server Components o Server Actions (carga inicial de página sin interacción) |

No mezclar: una función de `api/` usa un cliente u otro, nunca ambos
condicionalmente. Si una pantalla necesita datos server-side para el primer
render Y mutations client-side después, se escriben **dos funciones
separadas** (ver ejemplo real: `dashboard-overview` usa server client
porque solo lee; `courses-admin` usa browser client porque además crea/edita/borra).

## Una función por archivo, nombrada por acción

```
api/
  getCursos.ts       # listar
  getCursoById.ts     # obtener uno
  createCurso.ts       # crear
  updateCurso.ts        # actualizar
  deleteCurso.ts         # eliminar
  index.ts                # barrel: re-exporta todas
```

Nombre en `camelCase`, verbo en español si el resto del dominio está en
español (el repo mezcla inglés en nombres de archivo/función y español en
nombres de tabla/columna — sigue ese mismo patrón, no traduzcas nombres de
tabla ni columnas).

## Mapeo snake_case → camelCase

Las columnas de Postgres son `snake_case` (`instrumento_id`,
`duracion_semanas`). El dominio del frontend es `camelCase`. El mapeo
ocurre **dentro de la función de `api/`**, nunca se filtra un objeto crudo
de Supabase hacia `hooks/` o `ui/`:

```typescript
const cursos: ICourseListItem[] = data.map((curso) => ({
  id: curso.id,
  nombre: curso.nombre,
  instrumentoId: curso.instrumento_id,        // ← mapeo aquí
  duracionSemanas: curso.duracion_semanas,     // ← mapeo aquí
  instrumentoNombre: curso.instrumentos?.nombre ?? null, // join anidado
}))
```

Para el sentido inverso (formulario → payload de `insert`/`update`), el
mapeo camelCase→snake_case vive en `model/{Entidad}Form.config.ts` como
`build{Entidad}Payload()` — no en `api/`. Ver skill `gosmel-fsd-form`.

## Tipos: usar `Database` generado, no inventar tipos de API

El tipo fuente de verdad de las columnas es
`@/shared/api/supabase/database.types.ts` (generado por Supabase CLI/MCP).
Para enums de Postgres, referenciarlos así en vez de redeclarar el union:

```typescript
import type { Database } from "@/shared/api/supabase/database.types"

export type TCourseNivel = Database["public"]["Enums"]["nivel_curso"]
```

Si el tipo generado no está actualizado con la tabla real, regenerarlo
antes de escribir la función — nunca adivinar columnas.

## Joins y counts

Supabase permite embeber relaciones en el `select`. Usarlo para evitar
N+1 en listados:

```typescript
.select("id, nombre, instrumento_id, instrumentos(nombre)")
```

Para conteos sin traer filas (KPIs, dashboards):

```typescript
.select("id", { count: "exact", head: true }).eq("activo", true)
```

## Checklist para una función de api/ nueva

- [ ] ¿Ya existe una función equivalente en otro slice que se pueda
      reutilizar/promover a `entities/`?
- [ ] Cliente correcto: browser (client-side) vs server (Server
      Component/Action)
- [ ] Retorna `{ data, error }`, nunca hace `throw`
- [ ] Mapea `snake_case` → `camelCase` antes de retornar
- [ ] Tipa la respuesta contra `Database` de `database.types.ts`
- [ ] Un archivo por función, nombre en `camelCase` describiendo la acción
- [ ] Agregada al `index.ts` (barrel) del segmento `api/`
