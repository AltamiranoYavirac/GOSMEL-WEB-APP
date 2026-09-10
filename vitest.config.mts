import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
    },
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/**",
        "src/**/ui/**",
        "src/widgets/**",
        "src/shared/ui/**",
        "src/shared/form/**",
        "src/**/*.d.ts",
        "src/**/*.types.ts",
        "src/**/*.variants.ts",
        "src/**/*.constants.ts",
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/shared/api/supabase/database.types.ts",
      ],
      thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 },
    },
  },
})
