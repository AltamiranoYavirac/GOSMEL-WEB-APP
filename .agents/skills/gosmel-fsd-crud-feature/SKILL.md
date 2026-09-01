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

Ejemplo de referencia completo en el repo: `features/courses-admin/`
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
3. **Verifica el nombre del feature no choca con uno existente.** Si ya
   existe `features/{nombre}` sirviendo otro propósito (ej. `courses` es
   el catálogo estático de la landing, distinto de `courses-admin`),
   elige un nombre distinto — sufijo `-admin` es la convención usada.
4. **Revisa `entities/user/model/dashboard-nav.ts`** — si la ruta ya
   está en `ADMIN_NAV`, no la agregues de nuevo; si no está, agrégala.

## Los 5 pasos, en orden

### 1. `model/` — tipos + query-keys + form config

- `{entidad}.types.ts`: `I{Entidad}ListItem` (columnas para la tabla) y
  `I{Entidad}Detail` (todas las columnas, para el form de edición).
  Usa el tipo `Database["public"]["Enums"][...]` para enums.
- `query-keys.ts`: ver skill `gosmel-fsd-hooks`.
- `{Entidad}Form.config.ts`: ver skill `gosmel-fsd-form`. Incluye
  `build{Entidad}Payload()` para el insert/update.

### 2. `api/` — 5 funciones contra Supabase

`get{Entidades}` (lista, con joins necesarios), `get{Entidad}ById`
(detalle completo), `create{Entidad}`, `update{Entidad}`,
`delete{Entidad}` + `index.ts` barrel. Ver skill `gosmel-fsd-api` para el
contrato `{ data, error }` y elección de cliente Supabase.

### 3. `hooks/` — queries + mutations

`use{Entidades}` (lista), `use{Entidad}` (detalle condicional por id),
`useCreate{Entidad}`, `useUpdate{Entidad}`, `useDelete{Entidad}`. Ver
skill `gosmel-fsd-hooks`.

### 4. `ui/` — tres componentes con responsabilidad separada

```
ui/
  {Entidades}Table.tsx        # presentacional puro: recibe datos + callbacks
  {Entidades}Table.types.ts
  {Entidad}FormSheet.tsx       # Sheet con el formulario (crear o editar)
  {Entidad}FormSheet.types.ts
  {Entidades}View.tsx           # orquestador: estado + composición
  {Entidades}View.types.ts
```

**`{Entidades}Table`** — solo recibe `{items, isLoading, onEdit,
onDeleteRequest}` como props. No llama hooks de datos ni mutations. Estados
a cubrir: loading (skeletons), vacío (mensaje + ícono), con datos (tabla).

**`{Entidad}FormSheet`** — recibe `{open, onOpenChange, {entidad}Id}`
(`null` = creando, `string` = editando). Internamente:
- `use{Entidad}({entidad}Id)` para precargar si edita
- `useCreate{Entidad}` / `useUpdate{Entidad}` según el modo
- `useEffect` para `form.reset()` cuando llegan los datos o al abrir en
  modo creación
- Submit con `form="{entidad}-form"` en el botón del `SheetFooter` para
  poder tener el submit fuera del `<form>` visualmente

**`{Entidades}View`** — el componente que exporta el `index.ts` del
slice. Mantiene el estado de qué está abierto/seleccionado
(`formOpen`, `editingId`, `itemToDelete`) y compone Table + Sheet +
AlertDialog de borrado. Header con título + botón "Nuevo {entidad}".

### 5. Conectar la ruta

En `index.ts` del slice:

```typescript
export { default as {Entidades}View } from "./ui/{Entidades}View"
```

En `app/(private)/dashboard/admin/{ruta}/page.tsx`, reemplazar el
`<ComingSoon>` existente:

```tsx
import { {Entidades}View } from "@/features/{slice}-admin";

export default function {Entidad}Page() {
  return <{Entidades}View />;
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
npx eslint "src/features/{slice}-admin/**/*.{ts,tsx}" "src/entities/**/*.{ts,tsx}"
```

El lint debe pasar limpio, en particular la regla `boundaries/dependencies`
— confirma que no se importó una feature desde otra feature por error.

## Checklist completo

- [ ] Esquema real de la tabla revisado (MCP o `database.types.ts`)
- [ ] ¿Alguna FK necesita entity de catálogo? Creada si aplica
- [ ] Nombre del slice no choca con uno existente
- [ ] `model/`: types + query-keys + FormConfig
- [ ] `api/`: 5 funciones + barrel, contrato `{data, error}`
- [ ] `hooks/`: 2 queries + 3 mutations, invalidación correcta
- [ ] `ui/`: Table (presentacional) + FormSheet + View (orquestador)
- [ ] `index.ts` del slice exporta la View
- [ ] `page.tsx` de admin reemplazado
- [ ] Ítem de nav en `dashboard-nav.ts` (agregar si faltaba)
- [ ] `tsc --noEmit` y `eslint` limpios
