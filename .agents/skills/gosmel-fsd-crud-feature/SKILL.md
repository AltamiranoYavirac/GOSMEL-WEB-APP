---
name: gosmel-fsd-crud-feature
description: >-
  Genera una feature CRUD completa (listar, crear, editar, eliminar) contra
  una tabla de Supabase para el panel admin de GOSMEL-WEB-APP, siguiendo
  Feature-Sliced Design: model, api, hooks, ui, y el reemplazo del page.tsx
  correspondiente en app/(private)/dashboard/admin/. Usar SIEMPRE que se
  pida implementar una pantalla de administración nueva (docentes,
  estudiantes, catedras, pagos, etc.) o "conectar" una ruta que hoy muestra
  <ComingSoon> a su tabla real de Supabase. Se apoya en las skills
  gosmel-fsd-slice, gosmel-fsd-api, gosmel-fsd-form y gosmel-fsd-hooks —
  consultarlas para el detalle de cada segmento.
---

# GOSMEL FSD — Feature CRUD de Admin (composición completa)

Casi todas las rutas bajo `app/(private)/dashboard/admin/` siguen el mismo
molde: una tabla de Supabase, un listado con acciones, un formulario de
crear/editar en un `Sheet`, y confirmación de borrado con `AlertDialog`.
Esta skill arma las 5 piezas juntas y las conecta.

Ejemplo de referencia completo en el repo: `features/cursos/`
(tabla `cursos`). Úsalo como plantilla viva — copia su forma, no
necesariamente su contenido.

## Antes de empezar

1. **Lee el esquema real de la tabla** (vía Supabase MCP `list_tables` con
   `verbose: true`, o `database.types.ts`). No inventes columnas.
2. **Revisa si alguna columna es una FK a una tabla de catálogo**
   (`instrumento_id`, `docente_id`, etc.) que ya tenga o necesite una
   entity en `entities/` para poblar selects — ver regla de decisión en
   `gosmel-fsd-slice`. Si dos o más features van a necesitar ese catálogo,
   créalo como entity ANTES del feature CRUD.
3. **Verifica el nombre del feature no choca con uno existente.** Los
   slices de admin se nombran en español, sin sufijo (`cursos`,
   `docentes`, `estudiantes`, `catedras`, `pagos`…). Si un slice en
   inglés sirve otro propósito (ej. `courses` es el catálogo estático de
   la landing pública), el slice admin usa el nombre en español (`cursos`).
4. **Revisa `entities/user/model/dashboard-nav.ts`** — si la ruta ya
   está en `DASHBOARD_NAV` (o `DASHBOARD_NAV_FOOTER`), no la agregues de
   nuevo; si no está, agrégala.

## Los 5 pasos, en orden

### 1. `model/` — tipos + query-keys + form config

- `{entidad}.types.ts`: `I{Entidad}ListItem` (columnas para la tabla) y
  `I{Entidad}Detail` (todas las columnas, para el form de edición).
  Usa el tipo `Database["public"]["Enums"][...]` para enums.
- `query-keys.ts`: ver skill `gosmel-fsd-hooks`.
- `{Entidad}Form.config.ts`: ver skill `gosmel-fsd-form`. Incluye
  `build{Entidad}Payload()` para el insert/update.

### 2. `api/` — funciones contra Supabase

`get{Entidades}` (lista, con joins necesarios), `get{Entidad}ById`
(detalle completo), `crear{Entidad}`, `update{Entidad}`,
`eliminar{Entidad}`. Sin barrel de segmento. Ver skill `gosmel-fsd-api`
para el contrato `{ data, error }` y elección de cliente Supabase.

### 3. `hooks/` — queries + mutations

`use{Entidades}` (lista), `use{Entidad}` (detalle condicional por id),
`useCrear{Entidad}`, `useUpdate{Entidad}`, `useEliminar{Entidad}`. Ver
skill `gosmel-fsd-hooks`.

### 4. `ui/` — molde real del repo

```
ui/
  {Entidades}List.tsx          # AdminDataTable de @/shared/ui + estados + orquestación
  {Entidades}List.types.ts     # solo si define types propios
  Crear{Entidad}Dialog.tsx     # AlertDialog con el formulario de creación
  Crear{Entidad}Dialog.types.ts
  Editar{Entidad}Dialog.tsx    # AlertDialog de edición (precarga con use{Entidad})
  Editar{Entidad}Dialog.types.ts
  Eliminar{Entidad}Dialog.tsx  # AlertDialog de confirmación
  Eliminar{Entidad}Dialog.types.ts
```

**`{Entidades}List`** — el componente que exporta el `index.ts` del
slice. Llama `use{Entidades}()`, arma la `AdminDataTable` de `@/shared/ui`
y compone los diálogos de crear/editar/eliminar. Las definiciones de
`columns` y `filters` de `AdminDataTable` se declaran **dentro** del
componente: llevan `render: (row) => <JSX/>` y closures sobre handlers y
estado, no son constantes de datos puras — eso **no** cuenta como "array
grande inline" de la regla de `CLAUDE.md`.

**`Crear{Entidad}Dialog` / `Editar{Entidad}Dialog`** — `AlertDialog` con
el formulario (`useAppForm` + campos de `@/shared/form`, ver
`gosmel-fsd-form`). El de edición precarga con `use{Entidad}(id)`.
`mutation.isPending` para el loading del submit.

### 5. Conectar la ruta

En `index.ts` del slice:

```typescript
export { default as {Entidades}List } from "./ui/{Entidades}List"
```

En `app/(private)/dashboard/admin/{ruta}/page.tsx`:

```tsx
import { {Entidades}List } from "@/features/{slice}";

export default function {Entidad}Page() {
  return <{Entidades}List />;
}
```

## Decisiones de alcance por defecto (documentar si te desvías)

- **Sin subida de archivos/imágenes** en la primera versión del CRUD si la
  tabla tiene un campo `*_public_id` de Cloudinary — dejarlo fuera del
  formulario inicial y anotarlo como pendiente, salvo que te pidan
  explícitamente incluirlo.
- **Campo `orden` no se expone en el formulario** si existe — se queda en
  su default; reordenar es una feature aparte (drag & drop) si se pide.
- **Sin paginación ni búsqueda server-side** si la tabla tiene pocas
  filas esperadas (< 100). Si el volumen es mayor, agregar `search` +
  `Query`/paginación siguiendo `usePaginatedQuery` si existe, o pedir
  confirmación antes de construir paginación custom.

## Verificación antes de entregar

```bash
npx tsc --noEmit           # sin errores de tipos
npx eslint "src/features/{slice}/**/*.{ts,tsx}" "src/entities/**/*.{ts,tsx}"
```

El lint debe pasar limpio, en particular la regla `boundaries/dependencies`
— confirma que no se importó una feature desde otra feature por error.

## Checklist completo

- [ ] Esquema real de la tabla revisado (MCP o `database.types.ts`)
- [ ] ¿Alguna FK necesita entity de catálogo? Creada si aplica
- [ ] Nombre del slice no choca con uno existente
- [ ] `model/`: types + query-keys + FormConfig
- [ ] `api/`: 5 funciones, sin barrel de segmento, contrato `{data, error}`
- [ ] `hooks/`: 2 queries + 3 mutations, invalidación correcta
- [ ] `ui/`: {Entidades}List + Crear/Editar/Eliminar{Entidad}Dialog
- [ ] `index.ts` del slice exporta {Entidades}List
- [ ] `page.tsx` de admin conectado
- [ ] Ítem de nav en `dashboard-nav.ts` (agregar si faltaba)
- [ ] `tsc --noEmit` y `eslint` limpios
