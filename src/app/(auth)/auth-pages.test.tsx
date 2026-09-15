import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const siteAssets = vi.hoisted(() => ({
  getPublicSiteAssets: vi.fn(),
}))

vi.mock("@/entities/site-asset", () => ({
  getPublicSiteAssets: siteAssets.getPublicSiteAssets,
}))

vi.mock("@/features/login", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}))

vi.mock("@/features/register", () => ({
  RegisterForm: () => <div data-testid="register-form" />,
}))

vi.mock("@/shared/config", () => ({
  AppImages: {
    AUTH_LOGIN: "fallback-login",
    AUTH_REGISTER: "fallback-register",
  },
}))

vi.mock("@/shared/lib", () => ({
  buildCloudinaryImageUrl: (publicId: string, transformation: string) =>
    `cloudinary:${transformation}:${publicId}`,
}))

vi.mock("@/widgets/AuthSidePanel", () => ({
  AuthSidePanel: ({ image, imageAlt }: { image: string; imageAlt: string }) => (
    <aside data-testid="auth-side-panel" data-image={image} data-alt={imageAlt} />
  ),
}))

import LoginPage from "./login/page"
import RegisterPage from "./register/page"

const TRANSFORMATION = "ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto"

describe("páginas de autenticación", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it("usa el activo administrado en login", async () => {
    siteAssets.getPublicSiteAssets.mockResolvedValue({
      data: {
        auth_login: {
          key: "auth_login",
          name: "Login",
          publicId: "gosmel/sitio/login",
          alt: "Imagen administrada de login",
          order: 180,
        },
      },
      error: null,
    })

    render(await LoginPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute(
      "data-image",
      `cloudinary:${TRANSFORMATION}:gosmel/sitio/login`,
    )
    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute(
      "data-alt",
      "Imagen administrada de login",
    )
  })

  it("usa el activo administrado en registro", async () => {
    siteAssets.getPublicSiteAssets.mockResolvedValue({
      data: {
        auth_register: {
          key: "auth_register",
          name: "Registro",
          publicId: "gosmel/sitio/register",
          alt: "Imagen administrada de registro",
          order: 190,
        },
      },
      error: null,
    })

    render(await RegisterPage())

    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute(
      "data-image",
      `cloudinary:${TRANSFORMATION}:gosmel/sitio/register`,
    )
    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute(
      "data-alt",
      "Imagen administrada de registro",
    )
  })

  it("oculta el panel y deja una sola columna cuando no hay activo publicado", async () => {
    siteAssets.getPublicSiteAssets.mockResolvedValue({ data: {}, error: null })

    const { unmount } = render(await LoginPage({ searchParams: Promise.resolve({}) }))
    expect(screen.queryByTestId("auth-side-panel")).not.toBeInTheDocument()
    expect(screen.getByTestId("login-form").parentElement).not.toHaveClass("lg:grid-cols-2")

    unmount()
    render(await RegisterPage())
    expect(screen.queryByTestId("auth-side-panel")).not.toBeInTheDocument()
    expect(screen.getByTestId("register-form").parentElement).not.toHaveClass("lg:grid-cols-2")
  })

  it("usa las imágenes de respaldo solamente cuando falla la consulta", async () => {
    siteAssets.getPublicSiteAssets.mockResolvedValue({ data: null, error: "Sin conexión" })

    const { unmount } = render(await LoginPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute("data-image", "fallback-login")

    unmount()
    render(await RegisterPage())
    expect(screen.getByTestId("auth-side-panel")).toHaveAttribute("data-image", "fallback-register")
  })
})
