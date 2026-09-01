---
name: gosmel-fsd-form
description: >-
  Patrón para crear formularios en GOSMEL-WEB-APP con React Hook Form + Zod
  usando el sistema de src/shared/form/ (useAppForm, Form, campos conectados
  por name). Cubre el archivo {Entidad}Form.config.ts (schema + tipo +
  defaults + mappers) y la composición del formulario con los campos de
  shared/form. Usar SIEMPRE que se cree o edite un formulario — login,
  registro, o cualquier form de creación/edición dentro de un feature admin.
---

# GOSMEL FSD — Formularios (RHF + Zod)

Todo formulario del proyecto usa la capa única de `src/shared/form/`
(barrel `@/shared/form`). **Nunca** reintroducir `<FormField>`/`<FormItem>`
clásicos de shadcn — esos fueron eliminados a propósito.

## Archivo único: `{Entidad}Form.config.ts`

Vive en `model/` del slice. Contiene, en este orden, **todo junto en un
solo archivo** — no separar en `schemas.ts` + `types.ts` + `defaults.ts`:

1. Opciones de enum para selects (si aplica)
2. `{entidad}FormSchema` — el schema Zod
3. `I{Entidad}FormValues` — `z.infer<typeof schema>`
4. `get{Entidad}FormDefaults()` — valores iniciales para creación
5. `map{Entidad}ToFormValues()` — solo si el form también edita: convierte
   la entidad de dominio en valores de formulario
6. `build{Entidad}Payload()` — convierte valores de formulario en el
   payload `insert`/`update` de Supabase (camelCase → snake_case)

```typescript
// model/CourseForm.config.ts
import { z } from "zod"

export const NIVEL_CURSO_OPTIONS = [
  { value: "iniciacion", label: "Iniciación" },
  // ...
] as const

export const courseFormSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
  // ...
})

export type ICourseFormValues = z.infer<typeof courseFormSchema>

export function getCourseFormDefaults(): ICourseFormValues {
  return { nombre: "", nivel: "iniciacion" /* ... */ }
}

export function mapCourseToFormValues(course: ICourseDetail): ICourseFormValues {
  return { nombre: course.nombre, nivel: course.nivel /* ... */ }
}

export function buildCoursePayload(values: ICourseFormValues) {
  return { nombre: values.nombre, nivel: values.nivel /* snake_case si aplica */ }
}
```

Mensajes de error del schema **siempre en español**, dirigidos al usuario
final (no mensajes técnicos tipo "Invalid input").

## Composición del formulario

```tsx
"use client"

import { Form, TextField, SelectField, useAppForm } from "@/shared/form"
import { courseFormSchema, getCourseFormDefaults, type ICourseFormValues } from "../model/CourseForm.config"

const form = useAppForm<ICourseFormValues>({
  schema: courseFormSchema,
  defaultValues: getCourseFormDefaults(),
})

<Form form={form} onSubmit={onSubmit} id="course-form">
  <TextField name="nombre" label="Nombre" required />
  <SelectField name="nivel" label="Nivel" required options={NIVEL_CURSO_OPTIONS} />
</Form>
```

## Reglas obligatorias

- **Campos se consumen solo por `name`** (string). Nunca pasar `control`
  ni el objeto `field` completo — rompe el tipado genérico y la regla de
  lint `react-hooks/refs`.
- **`touched` = `isTouched || isSubmitted`.** Ya lo resuelve
  `useConnectedField` internamente — no reimplementar esa lógica en el
  componente de campo.
- **Loading del submit viene de `mutation.isPending`** (TanStack Query),
  nunca de `formState.isSubmitting`.
- **Forms de edición:** usar `values:` (no `defaultValues:`) cuando los
  datos llegan async, o resetear con `form.reset(map{Entidad}ToFormValues(data))`
  dentro de un `useEffect` que dispare cuando la query de detalle resuelva.
- **Submit puede vivir fuera del `<form>`** (footer de un `Sheet`/modal)
  usando el atributo HTML `form="<id>"` apuntando al `id` del `<Form>`.
- **Error de servidor:** prop `externalError` en el campo + limpiar con
  `onValueChange`. No usar `form.setError()` para errores de API.
- **Números:** usar `NumberField` con `asNumber` — nunca `TextField
  type="number"`, porque el navegador maneja mal decimales y locale.
  `asNumber` entrega `number | null` directo al schema.
- **Campos derivados de otro campo** (ej. `slug` autogenerado de
  `nombre`): usar `watch()` + `getFieldState(...).isDirty` para solo
  autocompletar mientras el usuario no haya tocado el campo derivado a
  mano. Ver `CourseFormSheet.tsx` como referencia de este patrón.

## Catálogo de campos disponibles (`@/shared/form`)

`TextField`, `TextareaField`, `PasswordField`, `NumberField`, `DateField`,
`TimeField`, `SelectField`, `CheckboxField`, `SwitchField`, `FileField`,
`PhotoField`. Cada uno tiene su `I{Campo}FieldProps` — revisar
`shared/form/fields/{Campo}/{Campo}.types.ts` antes de usar props que no
están documentadas aquí.

## Checklist para un formulario nuevo

- [ ] `{Entidad}Form.config.ts` en `model/` con schema + tipo + defaults
      (+ mappers si edita)
- [ ] Mensajes de validación en español, orientados al usuario
- [ ] Formulario compuesto con `useAppForm` + `Form` + campos de
      `@/shared/form`, nunca HTML `<form>` nativo ni shadcn `<FormField>`
- [ ] Campos referenciados solo por `name`
- [ ] Loading state = `mutation.isPending`
- [ ] Si edita: `map{Entidad}ToFormValues` + reset vía `useEffect`
- [ ] Si el payload va a Supabase: `build{Entidad}Payload` en el mismo
      archivo de config, invocado desde `api/create{Entidad}.ts` /
      `update{Entidad}.ts`
