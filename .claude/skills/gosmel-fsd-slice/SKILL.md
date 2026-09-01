---
name: gosmel-fsd-slice
description: >-
  Patrón para crear la estructura base de un slice (feature, entity o widget)
  en Feature-Sliced Design v2.1 dentro de GOSMEL-WEB-APP. Define segmentos,
  barrel export (index.ts), alias de import y dirección de dependencias
  permitida (app → widgets → features → entities → shared). Usar SIEMPRE que
  se cree un slice nuevo, antes de escribir código dentro de api/model/hooks/ui,
  o cuando haya dudas sobre en qué capa (feature vs entity vs widget vs shared)
  debe vivir algo.
---

# GOSMEL FSD — Estructura de Slice

Un **slice** es una carpeta con nombre de dominio dentro de una capa
(`features/{slice}`, `entities/{slice}`, `widgets/{Slice}`). Nunca se crea
código suelto directamente en `src/app/` más allá de rutas y layouts — toda
lógica de negocio o UI compuesta vive en un slice.

## Capas y cuándo usar cada una

| Capa | Contiene | Ejemplo real en el repo |
|---|---|---|
| `app/` | Rutas Next.js (App Router), layouts, providers globales | `app/(private)/dashboard/admin/cursos/page.tsx` |
| `widgets/` | Bloques UI compuestos que combinan features + entities | `DashboardSidebar`, `LandingPage` |
| `features/` | Lógica de negocio por caso de uso concreto | `login`, `register`, `session`, `courses-admin` |
| `entities/` | Modelos de dominio puros, reutilizados por 2+ features | `user`, `instrument` |
| `shared/` | Reutilizable sin lógica de negocio: UI kit, forms, utils, clientes API | `shared/ui`, `shared/form`, `shared/api/supabase` |

**Regla de decisión feature vs entity:** si un dato o llamada a API la va a
consumir **una sola feature**, la función vive dentro de esa feature
(`features/{slice}/api/`). Si **dos o más features** necesitan el mismo dato
(ej. `instrumentos` lo usan `cursos`, `catedras`, `programas`, `docentes`),
promuévelo a `entities/{nombre}/`. No crear una entity "por si acaso" — eso
es sobre-ingeniería (YAGNI). Empieza en la feature; muévelo a `entities/`
solo cuando aparece el segundo consumidor real.

## Estructura interna de un slice

```
features/{slice}/          (o entities/{slice}/, widgets/{Slice}/)
  index.ts                 # Barrel — ÚNICA API pública del slice
  api/                      # Llamadas a Supabase / servicios externos
    {accion}{Entidad}.ts    # una función por archivo
    index.ts                # barrel del segmento
  model/                    # Tipos, schemas Zod, query-keys, constantes
    {entidad}.types.ts
    query-keys.ts
    {Entidad}Form.config.ts # solo si hay formulario — ver skill gosmel-fsd-form
  hooks/                    # Wrappers "use client" de TanStack Query
    use{Accion}.ts           # un hook por archivo
  ui/                        # Componentes React
    {Componente}.tsx
    {Componente}.types.ts    # OBLIGATORIO — nunca interfaces inline
    {Componente}.variants.ts # solo si usa tv() con 3+ variantes
```

No todos los segmentos son obligatorios. Un slice de solo-lectura puede no
tener `hooks/` si usa Server Components; una entity simple puede tener solo
`model/`. **No inventes segmentos fuera de esta lista** (nada de `utils/`,
`helpers/`, `services/` sueltos en la raíz del slice — esas cosas van dentro
de `model/` o `shared/lib/`).

## index.ts — barrel export

El `index.ts` es la única puerta de entrada al slice. Otras capas **nunca**
importan de `features/{slice}/ui/Componente` directo — siempre de
`@/features/{slice}`.

```typescript
// features/login/index.ts
export { default as LoginForm } from "./ui/LoginForm"
export type { ILoginFormValues } from "./model/loginForm.config"
export { useLogin } from "./hooks/useLogin"
```

Exporta solo lo que consumidores externos necesitan. Tipos y funciones
internas del slice (helpers de `model/`, funciones de `api/` no usadas
fuera) se quedan sin exportar en el barrel.

## Alias de import

Usar siempre el alias `@/{capa}/{slice}/...`, nunca rutas relativas que
crucen de capa:

```typescript
// ✅ correcto
import { useActiveInstruments } from "@/entities/instrument"
import { Button } from "@/shared/ui"

// ❌ nunca
import { useActiveInstruments } from "../../../entities/instrument"
```

Dentro del mismo slice, rutas relativas cortas sí son aceptables
(`../api`, `./CourseFormSheet.types`).

> El `tsconfig.json` define también `@app/*`, `@widgets/*`, `@features/*`,
> `@entities/*`, `@shared/*` pero **ningún archivo del repo los usa
> actualmente** — todo el código real importa con el alias único `@/*`.
> Sigue ese patrón real; no introduzcas los alias por-capa salvo que el
> equipo decida migrar explícitamente.

## Dirección de dependencias — regla dura

Impuesta por `eslint-plugin-boundaries` en `eslint.config.mjs`. Correr
`yarn lint` detecta violaciones automáticamente, pero conviene saberla de
memoria antes de escribir el import:

```
app → widgets, features, entities, shared
widgets → features, entities, shared
features → entities, shared   (+ una feature puede importarse a sí misma)
entities → shared
shared → shared
```

**Nunca:**
- Una `feature` importa otra `feature` directamente (ej. `courses-admin`
  no puede importar de `catedras-admin`). Si necesitan compartir algo,
  ese algo sube a `entities/` o `shared/`.
- Cualquier capa importa "hacia arriba" (ej. `entities/` no importa de
  `features/`).
- `shared/` importa de `entities/`, `features/`, `widgets/` o `app/`.

## Checklist para crear un slice nuevo

- [ ] ¿Ya existe un slice con este propósito? (`grep -r` antes de crear)
- [ ] Decidir capa: ¿lo consume una sola feature (→ `features/`) o dos o
      más (→ `entities/`)? ¿Es un bloque de composición de UI (→ `widgets/`)?
- [ ] Nombre del slice: `kebab-case` para `features/` y `entities/`,
      `PascalCase` para `widgets/` (ver convención real: `login`,
      `courses-admin` vs `DashboardSidebar`)
- [ ] Crear solo los segmentos que el slice realmente necesita
- [ ] `index.ts` exportando únicamente la API pública
- [ ] Verificar con `yarn lint` que no viola `boundaries/dependencies`
