# CLAUDE.md — GOSMEL Music Academy

@AGENTS.md

## Agent Behavior

### Output
- Return code first. Explanation after, only if non-obvious.
- No preamble. No "Great question!", "Sure!", "Of course!".
- No hollow closings. No "I hope this helps!".
- No restating the prompt. If the task is clear, execute immediately.
- No unsolicited suggestions. Do exactly what was asked, nothing more.
- No redundant context. Do not repeat information already established in the session.

### Code Rules
- Simplest working solution. No over-engineering.
- No abstractions for single-use operations.
- Exception: three or more components sharing the same Tailwind variants -> use `tv()`.
- No speculative features or "you might also want...".
- Read the file before modifying it. Never edit blind.
- No error handling for scenarios that cannot happen.
- NO COMENTARIES!
- Responsabilty Unique!, Don`t allow 2 components in unique File
- Large constants go in their own file, following the project architecture (`features/[nombre]/model/` or `shared/config/` for global ones). Never inline large arrays/maps in components or pages.
- use other compnents when is necessary, if not, create a new one.

### Review & Debugging
- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.
- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

### Accuracy
- Never speculate about code, files, or APIs not yet read.
- Never invent file paths, function names, or API signatures.
- If unsure: say "I don't know."

---


## Stack tecnológico

| Capa | Tecnología | Estado |
|---|---|---|
| Framework | Next.js 16 (App Router) | ✅ instalado (`16.2.6`) |
| UI runtime | React 19 (`19.2.4`) | ✅ instalado |
| Lenguaje | TypeScript (strict mode) | ✅ instalado |
| Estilos | Tailwind CSS **v4** (config CSS-first, sin `tailwind.config`) | ✅ instalado (`4.2.4`) — paleta cálida gatos; escalas `primary/secondary/accent/neutral` + aliases `ginger/cream/cocoa/…` |
| Componentes | shadcn/ui (Radix UI base, style `radix-nova`) | ✅ instalado |
| Variantes visuales | tailwind-variants `tv()` | ✅ instalado |
| Gestor de paquetes | Yarn (`yarn.lock` es el lockfile versionado) | ✅ |
| Formularios | React Hook Form + Zod + `@hookform/resolvers` | ✅ instalado |
| Lint arquitectura | `eslint-plugin-boundaries` (regla FSD `boundaries/dependencies`) | ✅ instalado |
| Async / Caché | TanStack Query v5 (React Query) | ✅ instalado (`Providers` en `app/providers.tsx`) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) | ⏳ pendiente — fase privada/RBAC |
| Archivos | Cloudinary (imágenes, PDFs, partituras) | ⏳ pendiente |
| Deploy | Vercel | ✅ |
| CI/CD | GitHub → Vercel (auto-deploy en push a main) | ✅ |

> Las filas marcadas ⏳ describen la arquitectura objetivo; sus convenciones (más abajo)
> aplican al instalar la librería correspondiente. No están en `package.json` todavía.

---

## Arquitectura: Feature-Sliced Design (FSD)

### Regla de dependencias — NUNCA romper esta regla

```
app → widgets → features → entities → shared
```

- Cada capa solo importa hacia abajo.
- Una `feature` NUNCA importa otra `feature` directamente.
- Comunicación entre features: a través de `entities` o `shared`.

### Estructura de carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rutas públicas (sin auth)
│   │   ├── teachers/
│   │   ├── instruments/
│   │   ├── masterclasses/
│   │   └── contact/
│   ├── (private)/                # Rutas protegidas por middleware
│   │   └── dashboard/
│   │       ├── student/
│   │       ├── teacher/
│   │       └── admin/
│   ├── api/                      # Route Handlers REST si se necesitan
│   ├── layout.tsx
│   └── page.tsx                  # Landing principal
│
├── middleware.ts                 # RBAC — verificación de roles (raíz de src/, stub hoy)
│
├── features/                     # Lógica de negocio por dominio
│   ├── auth/
│   │   ├── ui/                   # Componentes de login/registro
│   │   ├── model/                # Tipos, schemas Zod, lógica
│   │   ├── api/                  # Llamadas a Supabase Auth
│   │   └── index.ts              # Barrel export público
│   ├── courses/
│   ├── materials/
│   ├── teachers/
│   └── contact/
│
├── entities/                     # Modelos de dominio puros (sin side effects)
│   ├── user/                     # User, Role, enums de permisos
│   ├── course/                   # Course, Lesson, Material
│   └── teacher/                  # Teacher, Schedule
│
├── widgets/                      # Bloques UI compuestos (usan features + entities)
│   ├── Navbar/
│   ├── DashboardSidebar/
│   └── CourseMaterialList/
│
└── shared/                       # Reutilizable sin lógica de negocio
    ├── ui/                       # shadcn components customizados
    ├── api/                      # Cliente Supabase singleton, fetch helpers
    ├── lib/                      # utils, formatters, cn()
    └── types/                    # Tipos globales compartidos
```

### Estructura interna de cada feature

```
features/[nombre]/
├── ui/          # Componentes React (solo presentación)
├── model/       # Tipos TypeScript, schemas Zod, query-keys
├── api/         # Adaptadores: llamadas a Supabase / Cloudinary
├── hooks/       # Custom hooks con useQuery / useMutation
└── index.ts     # Único punto de entrada público de la feature
```

---


## Convenciones de código

### Nombrado — reglas sin excepción

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | `PascalCase` | `CourseCard.tsx` |
| Hooks personalizados | `camelCase` prefijo `use` + recurso en plural | `useCourses.ts`, `useMaterials.ts` |
| Interfaces | `PascalCase` prefijo `I` | `ICourse`, `ITeacher` |
| Types (type alias) | `PascalCase` prefijo `T` | `TCourseStatus`, `TRole` |
| Enums | `PascalCase` | `UserRole`, `MaterialType` |
| Funciones y variables | `camelCase` | `formatDate`, `courseList` |
| Archivos de utilidad | `kebab-case` | `format-date.ts`, `query-keys.ts` |
| Constantes globales | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE_MB` |
| Archivos de tipos | `kebab-case` sufijo `.types.ts` | `course.types.ts` |

### Tipos en archivo separado — obligatorio

**Todo componente, hook o módulo que defina interfaces o types los coloca en su propio archivo `.types.ts` en la misma carpeta.** Nunca declarar interfaces inline en el mismo archivo del componente.

```
features/courses/ui/
├── CourseCard.tsx          # solo JSX y lógica de presentación
└── CourseCard.types.ts     # ICourseCardProps, TCourseCardVariant

features/courses/model/
├── schemas.ts              # schemas Zod
└── course.types.ts         # ICourse, TCourseStatus, enums
```

Esto aplica también en `entities/`, `widgets/` y `shared/`.

### Componentes
- Preferir Server Components por defecto en App Router.
- Usar `'use client'` solo cuando sea estrictamente necesario (interactividad, hooks de estado).
- No pasar funciones como props a Server Components.
- Las props de cada componente se tipan con una interfaz `I[NombreComponente]Props` en su `.types.ts`.

### Estilos con Tailwind v4

- **Tailwind v4: config CSS-first.** No existe `tailwind.config.{js,ts}`. Tokens, tema y
  variantes se declaran en `src/app/globals.css` vía `@import "tailwindcss"`, `@theme inline`
  y `@custom-variant`. PostCSS usa `@tailwindcss/postcss`.
- shadcn/ui está instalado con style `radix-nova` (ver `components.json`); sus componentes
  customizados viven en `shared/ui` (alias `@/shared/ui`), `cn()` en `@/shared/lib/utils`.
- **`tv()` (tailwind-variants) aún no está instalado.** Cuando se instale: usarlo para todo
  componente con variantes visuales (no `cn()` condicional), con las variantes en
  `[Componente].variants.ts` junto a su `.types.ts`. Mientras tanto, `cn()` + clases directas.
- `cn()` solo para overrides puntuales no-variante (márgenes externos, layout).

### Paleta de colores — tokens semánticos OBLIGATORIOS

**Escalas (definidas en `@theme inline`, `src/app/globals.css`):**
- `primary` — Naranja Jengibre (#E19246 @ 500), escala 50→950
- `secondary` — Mantequilla Pastel (#F6CF86 @ 500)
- `accent` — Melocotón Suave (#EBC29D @ 300)
- `warm` — Crema→Cocoa cálido (50→950). **Nota:** `warm` reemplazó a `neutral` en esta codebase; `neutral` no existe.

**Semánticos shadcn (mapeados a `--color-*` en `@theme inline`):**
`background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-*`

**Semánticos adicionales (propios del proyecto):**
| Token | Uso | Light | Dark |
|---|---|---|---|
| `surface-dark / surface-dark-foreground / surface-dark-muted / surface-dark-border` | Secciones oscuras (Footer, AboutCTA) | warm-900/warm-50/warm-300/warm-700 | warm-950/warm-50/warm-400/warm-600 |
| `scrim` | Overlay transparente (modales, sheets) | warm-900/10% | black/30% |
| `scrim-strong` | Overlay intenso (scrims sobre imágenes) | warm-900/60% | black/80% |
| `accent-muted` | Fondo/borde muted que se adapta al tema | warm-100 | warm-800 |
| `primary-tint / primary-tint-strong` | Versión clara del primary (bubble tinted) | derivado primary-500 | derivado primary-dark |

**Alias conservados:** solo `cream` (=warm-50) y `ginger` (=primary-500), exclusivo para `selection:` en `layout.tsx`. El resto (`sand, peach, butter, burnt, copper, cocoa, taupe`) están eliminados.

**Dark mode — diseño intencional:** `--primary` en `.dark` cambia a `secondary-500` (butter) para mejor contraste sobre cocoa. No corregir; es decisión de diseño documentada.

**`chart-1..5`** usan `var(--color-primary-500)` etc (no duplican OKLCH). Si la paleta cambia, charts se actualizan automáticamente.

**CONVENCIÓN ESTRICTA — nunca usar en componentes:**
- `bg-black`, `text-white`, `bg-neutral-*`, `text-neutral-*` (la escala se llama `warm`)
- `oklch(...)` hardcoded en className (ni con `bg-[oklch(...)]`)
- Colores Tailwind default (red, blue, slate, zinc, etc.)
- Siempre usar el token semántico correspondiente: `bg-background`, `text-primary`, `border-accent-muted/40`, `bg-scrim`, etc.

### Formularios — React Hook Form + Zod
- `useForm` con `zodResolver`. Schema en `features/[nombre]/model/schemas.ts`.
- Nunca `useState` para campos — RHF lo gestiona.
- shadcn/ui via `<FormField>` + `<Controller>`. Mismo schema en server-side.

### Peticiones asíncronas — TanStack Query v5
- **Todo fetch cliente pasa por React Query.** No `useEffect` + `fetch` manual.
- Query keys como constantes en `features/[nombre]/model/query-keys.ts`.
- Funciones fetch en `features/[nombre]/api/`, llamadas desde custom hooks por feature.
- `useMutation` + `onSuccess` invalidan caché con `queryClient.invalidateQueries`.
- Server Components: fetch directo `async/await` — React Query solo en `'use client'`.
- `QueryClientProvider` en `app/providers.tsx`, envuelto en layout raíz.

### Manejo de errores
- Las funciones de `api/` siempre retornan `{ data, error }` (patrón Supabase).
- Nunca hacer throw en las capas de presentación — manejar errores en la capa `api/`.
- Usar `error-boundary` en layouts de dashboard.

---

## Comandos del proyecto

```bash
yarn dev          # Servidor de desarrollo (localhost:3000)
yarn build        # Build de producción
yarn start        # Servir el build de producción
yarn lint         # ESLint
```

> `type-check` y `format` aún no existen como scripts. Para chequeo de tipos: `npx tsc --noEmit`.

---

## Supabase — notas importantes

- Usar el cliente singleton de `shared/api/supabase.ts`.
- **Row Level Security (RLS) activo** en todas las tablas. No desactivar.
- Las políticas RLS son la segunda línea de defensa (el middleware es la primera).
- El Storage de Supabase se usa para archivos internos de bajo volumen.
- Cloudinary se usa para partituras, PDFs e imágenes que se sirven públicamente.

---

## Lo que NO está en fase 1

- ❌ Cursos online (video/audio)
- ❌ Pasarela de pagos
- ❌ App móvil
- ❌ Sistema de notificaciones push

Cuando se agreguen: cada uno es una `feature` nueva. La arquitectura no cambia.

---

*Última actualización: Mayo 2026 — Reed / GOSMEL Music Academy*