import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getStudentContext: vi.fn(),
  getStudentOverview: vi.fn(),
  getStudentCatedras: vi.fn(),
  getStudentGrades: vi.fn(),
  getStudentAttendance: vi.fn(),
  getStudentSessions: vi.fn(),
  getStudentPracticeLogs: vi.fn(),
  getStudentReviews: vi.fn(),
  getStudentCertificates: vi.fn(),
  getStudentFavorites: vi.fn(),
  getStudentMaterials: vi.fn(),
  getStudentAccountStatement: vi.fn(),
  getStudentCurriculum: vi.fn(),
  getCatedrasDisponibles: vi.fn(),
  createCourseReview: vi.fn(),
  createPracticeLog: vi.fn(),
  reportStudentPayment: vi.fn(),
  solicitarMatricula: vi.fn(),
  toggleFavorite: vi.fn(),
}))

vi.mock("../api/getStudentContext", () => ({ getStudentContext: api.getStudentContext }))
vi.mock("../api/getStudentOverview", () => ({ getStudentOverview: api.getStudentOverview }))
vi.mock("../api/getStudentCatedras", () => ({ getStudentCatedras: api.getStudentCatedras }))
vi.mock("../api/getStudentGrades", () => ({ getStudentGrades: api.getStudentGrades }))
vi.mock("../api/getStudentAttendance", () => ({ getStudentAttendance: api.getStudentAttendance }))
vi.mock("../api/getStudentSessions", () => ({ getStudentSessions: api.getStudentSessions }))
vi.mock("../api/getStudentPracticeLogs", () => ({ getStudentPracticeLogs: api.getStudentPracticeLogs }))
vi.mock("../api/getStudentReviews", () => ({ getStudentReviews: api.getStudentReviews }))
vi.mock("../api/getStudentCertificates", () => ({ getStudentCertificates: api.getStudentCertificates }))
vi.mock("../api/getStudentFavorites", () => ({ getStudentFavorites: api.getStudentFavorites }))
vi.mock("../api/getStudentMaterials", () => ({ getStudentMaterials: api.getStudentMaterials }))
vi.mock("../api/getStudentAccountStatement", () => ({ getStudentAccountStatement: api.getStudentAccountStatement }))
vi.mock("../api/getStudentCurriculum", () => ({ getStudentCurriculum: api.getStudentCurriculum }))
vi.mock("../api/getCatedrasDisponibles", () => ({ getCatedrasDisponibles: api.getCatedrasDisponibles }))
vi.mock("../api/createCourseReview", () => ({ createCourseReview: api.createCourseReview }))
vi.mock("../api/createPracticeLog", () => ({ createPracticeLog: api.createPracticeLog }))
vi.mock("../api/reportStudentPayment", () => ({ reportStudentPayment: api.reportStudentPayment }))
vi.mock("../api/solicitarMatricula", () => ({ solicitarMatricula: api.solicitarMatricula }))
vi.mock("../api/toggleFavorite", () => ({ toggleFavorite: api.toggleFavorite }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCatedrasDisponibles } from "./useCatedrasDisponibles"
import { useCreateCourseReview } from "./useCreateCourseReview"
import { useCreatePracticeLog } from "./useCreatePracticeLog"
import { useReportStudentPayment } from "./useReportStudentPayment"
import { useSolicitarMatricula } from "./useSolicitarMatricula"
import { useStudentAccountStatement } from "./useStudentAccountStatement"
import { useStudentAttendance } from "./useStudentAttendance"
import { useStudentCatedras } from "./useStudentCatedras"
import { useStudentCertificates } from "./useStudentCertificates"
import { useStudentContext } from "./useStudentContext"
import { useStudentCurriculum } from "./useStudentCurriculum"
import { useStudentFavorites } from "./useStudentFavorites"
import { useStudentGrades } from "./useStudentGrades"
import { useStudentMaterials } from "./useStudentMaterials"
import { useStudentOverview } from "./useStudentOverview"
import { useStudentPracticeLogs } from "./useStudentPracticeLogs"
import { useStudentReviews } from "./useStudentReviews"
import { useStudentSessions } from "./useStudentSessions"
import { useToggleFavorite } from "./useToggleFavorite"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("student-portal hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useStudentContext(),
      () => useStudentOverview("e1"),
      () => useStudentCatedras("e1"),
      () => useStudentGrades("e1"),
      () => useStudentAttendance("e1"),
      () => useStudentSessions("e1"),
      () => useStudentPracticeLogs("e1"),
      () => useStudentReviews("e1"),
      () => useStudentCertificates("e1"),
      () => useStudentFavorites(),
      () => useStudentMaterials("e1"),
      () => useStudentAccountStatement("e1"),
      () => useStudentCurriculum("e1"),
      () => useCatedrasDisponibles("e1"),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [() => useCreateCourseReview("e1"), api.createCourseReview],
      [() => useCreatePracticeLog("e1"), api.createPracticeLog],
      [() => useReportStudentPayment("e1"), api.reportStudentPayment],
      [useSolicitarMatricula, api.solicitarMatricula],
      [useToggleFavorite, api.toggleFavorite],
    ]

    for (const [hook, expected] of cases) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await result.current.mutateAsync("x" as never)
      })
      expect(expected).toHaveBeenCalled()
      unmount()
    }
  })

  it("propaga errores de queries y mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const query = renderHook(() => useStudentContext(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      () => useCreateCourseReview("e1"),
      () => useCreatePracticeLog("e1"),
      () => useReportStudentPayment("e1"),
      useSolicitarMatricula,
      useToggleFavorite,
    ]

    for (const hook of mutations) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await expect(result.current.mutateAsync("x" as never)).rejects.toThrow("boom")
      })
      unmount()
    }
  })
})
