import { describe, expect, it } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getStudentMaterials } from "./getStudentMaterials"

describe("getStudentMaterials", () => {
  it("devuelve [] sin inscripciones", async () => {
    const result = await getStudentMaterials("e1", createFakeSupabase({ inscripciones: [] }))

    expect(result).toEqual({ data: [], error: null })
  })

  it("construye hrefs de storage, URL externa y destino", async () => {
    const result = await getStudentMaterials(
      "e1",
      createFakeSupabase({
        inscripciones: [
          { estudiante_id: "e1", catedra_id: "c1", estado: "activa", catedras: { curso_id: "k1" } },
        ],
        materiales: [
          {
            id: "m1",
            titulo: "Partitura",
            tipo: "partitura",
            storage_path: "gosmel/materiales/partitura 1.pdf",
            url_externa: null,
            catedra_id: "c1",
            curso_id: "k1",
            visible_para: "registrados",
            catedras: { codigo: "C-01" },
            cursos: { nombre: "Guitarra" },
          },
          {
            id: "m2",
            titulo: "Video",
            tipo: "video",
            storage_path: "https://cdn.example.com/video.mp4",
            url_externa: null,
            catedra_id: null,
            curso_id: "k1",
            visible_para: "inscritos",
            catedras: null,
            cursos: { nombre: "Guitarra" },
          },
          {
            id: "m3",
            titulo: "Enlace",
            tipo: "enlace",
            storage_path: null,
            url_externa: "https://externo.example.com",
            catedra_id: "c1",
            curso_id: null,
            visible_para: "publico",
            catedras: null,
            cursos: null,
          },
          {
            id: "m4",
            titulo: "Otro curso",
            tipo: "pdf",
            storage_path: "otro.pdf",
            url_externa: null,
            catedra_id: "c9",
            curso_id: "k9",
            visible_para: "registrados",
            catedras: null,
            cursos: null,
          },
        ],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(3)

    expect(result.data![0]).toMatchObject({
      id: "m1",
      href: "/api/storage?path=gosmel%2Fmateriales%2Fpartitura%201.pdf",
      destino: "C-01",
    })
    expect(result.data![1]).toMatchObject({
      id: "m2",
      href: "https://cdn.example.com/video.mp4",
      destino: "Guitarra",
    })
    expect(result.data![2]).toMatchObject({
      id: "m3",
      href: "https://externo.example.com",
      destino: null,
    })
  })

  it("propaga error de materiales", async () => {
    const result = await getStudentMaterials(
      "e1",
      createFakeSupabase.withError("materiales", "boom", {
        inscripciones: [{ estudiante_id: "e1", catedra_id: "c1", estado: "activa", catedras: null }],
      }),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
