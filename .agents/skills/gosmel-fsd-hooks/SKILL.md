---
name: gosmel-fsd-hooks
description: >-
  Patrón para escribir hooks del segmento hooks/ de un slice FSD en
  GOSMEL-WEB-APP usando TanStack Query v5: queries, mutations, query-keys
  jerárquicas e invalidación de caché. Usar SIEMPRE al crear código dentro
  de features/{slice}/hooks/ o entities/{slice}/hooks/, o cuando se necesite
  conectar una función de api/ con un componente cliente.
---

# GOSMEL FSD — Segmento hooks/ (TanStack Query)

Todo fetch o mutation desde un Client Component pasa por un hook de
`hooks/` que envuelve TanStack Query. **Nunca** `useEffect` + llamada
directa a `api/` desde un componente — eso pierde caché, invalidación y
manejo de loading/error gratis que da la librería.

Server Components no usan esto: llaman a `api/` directo con `await`
(ver `dashboard-overview/api/loadDashboardOverview.ts` como referencia).

## Query keys jerárquicas

Un archivo `model/query-keys.ts` por slice, siempre con esta forma:

```typescript
export const coursesAdminQueryKeys = {
  all: ["courses-admin"] as const,
  lists: () => [...coursesAdminQueryKeys.all, "list"] as const,
  detail: (id: string) => [...coursesAdminQueryKeys.all, "detail", id] as const,
}
```

`all` sirve para invalidar todo el slice de una vez;
`lists()`/`detail(id)` para invalidaciones quirúrgicas. No usar arrays de
strings sueltos inline en cada hook — siempre a través de este objeto.

## Hook de listado (query)

```typescript
"use client"

import { useQuery } from "@tanstack/react-query"
import { getCursos } from "../api"
import { coursesAdminQueryKeys } from "../model/query-keys"

export function useCourses() {
  return useQuery({
    queryKey: coursesAdminQueryKeys.lists(),
    queryFn: async () => {
      const { data, error } = await getCursos()
      if (error || !data) {
        throw new Error(error ?? "No se pudieron cargar los cursos.")
      }
      return data
    },
  })
}
```

**Este `throw` es el único lugar donde una función de `api/` "lanza"
error** — pasa por el hook, no dentro de `api/` (ver skill `gosmel-fsd-api`).

## Hook de detalle (query condicional)

Cuando el id puede no existir todavía (ej. sheet de edición cerrado), usar
`enabled`:

```typescript
export function useCourse(id: string | null) {
  return useQuery({
    queryKey: coursesAdminQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      const { data, error } = await getCursoById(id as string)
      if (error || !data) throw new Error(error ?? "No se pudo cargar el curso.")
      return data
    },
    enabled: !!id,
  })
}
```

## Hooks de mutation

Un archivo por mutation (`useCreateCourse.ts`, `useUpdateCourse.ts`,
`useDeleteCourse.ts`), no un hook combinado con las tres. Cada uno invalida
las queries que su cambio afecta:

```typescript
export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: ICourseFormValues) => {
      const { data, error } = await createCurso(values)
      if (error || !data) throw new Error(error ?? "No se pudo crear el curso.")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesAdminQueryKeys.lists() })
    },
  })
}
```

Para `update`, invalidar tanto la lista como el detalle del id afectado:

```typescript
onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({ queryKey: coursesAdminQueryKeys.lists() })
  queryClient.invalidateQueries({ queryKey: coursesAdminQueryKeys.detail(variables.id) })
},
```

## Consumo en el componente

El componente nunca hace try/catch sobre el `error` de la query para
mostrarlo — usa `mutation.isPending` / `query.isLoading` / `query.isError`
directamente, y el `mutateAsync` se envuelve en try/catch **solo** para
disparar el toast de éxito/error:

```typescript
try {
  await createCourse.mutateAsync(values)
  toast.success("Curso creado")
} catch (error) {
  toast.error(error instanceof Error ? error.message : "No se pudo guardar.")
}
```

## Checklist para hooks nuevos

- [ ] `model/query-keys.ts` existe con `all`/`lists()`/`detail(id)`
- [ ] Un hook por archivo, `"use client"` al inicio
- [ ] `queryFn`/`mutationFn` hacen el `throw new Error(...)` cuando
      `api/` retorna `error`
- [ ] Mutations invalidan las query-keys correctas en `onSuccess`
- [ ] Componentes usan `isPending`/`isLoading`/`isError` de la librería,
      no estado propio duplicado
