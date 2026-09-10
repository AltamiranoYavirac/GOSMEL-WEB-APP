import type { Config } from "tailwindcss";

/**
 * GOSMEL Music Academy — design tokens.
 *
 * The project is Tailwind v4 (CSS-first): the source of truth for every token
 * lives in `src/app/globals.css` under `@theme` / `@theme inline`, and it is
 * pulled in here via the `@config` directive at the top of that file.
 *
 * This file mirrors the semantic palette so the tokens are also documented and
 * resolvable from JS-config consumers. All values reference the CSS variables
 * declared in `:root` — never hard-coded hex — so the palette stays single-source.
 *
 * Light mode only. No `.dark` palette, no theme toggle.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#fff4e8",
          100: "#ffe4c6",
          200: "#fecf9c",
          300: "#fbb066",
          400: "#f99a3a",
          500: "#f68704",
          600: "#d97404",
          700: "#b45c05",
          800: "#8f4a0c",
          900: "#743d10",
          950: "#421f04",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "#fdece7",
          100: "#fbd7cc",
          200: "#f7b3a0",
          300: "#f28469",
          400: "#ec5232",
          500: "#e22603",
          600: "#c11f03",
          700: "#9c1a06",
          800: "#7c1809",
          900: "#63170c",
          950: "#370a03",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          50: "#fffce6",
          100: "#fff7c0",
          200: "#ffee85",
          300: "#ffe340",
          400: "#fedc1a",
          500: "#feda08",
          600: "#dbb500",
          700: "#b08d02",
          800: "#8a6d08",
          900: "#75590d",
          950: "#443000",
        },
        warm: {
          50: "#fafafa",
          100: "#f4f4f3",
          200: "#e5e5e5",
          300: "#d4d4d3",
          400: "#a3a3a1",
          500: "#6b6b6b",
          600: "#565655",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0d0d0d",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        cream: "var(--color-warm-50)",
        ginger: "var(--color-primary-500)",
        "surface-dark": {
          DEFAULT: "var(--surface-dark)",
          foreground: "var(--surface-dark-foreground)",
          muted: "var(--surface-dark-muted)",
          border: "var(--surface-dark-border)",
        },
        scrim: {
          DEFAULT: "var(--scrim)",
          strong: "var(--scrim-strong)",
        },
        "accent-muted": "var(--accent-muted)",
        "primary-tint": {
          DEFAULT: "var(--primary-tint)",
          strong: "var(--primary-tint-strong)",
        },
        "stage-accent": "var(--stage-accent)",
        success: {
          DEFAULT: "var(--success)",
          fg: "var(--success-fg)",
          tint: "var(--success-tint)",
          border: "var(--success-border)",
        },
        info: {
          DEFAULT: "var(--info)",
          fg: "var(--info-fg)",
          tint: "var(--info-tint)",
          border: "var(--info-border)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          fg: "var(--warning-fg)",
          tint: "var(--warning-tint)",
          border: "var(--warning-border)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          fg: "var(--danger-fg)",
          tint: "var(--danger-tint)",
          border: "var(--danger-border)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) * 0.6)",
        md: "calc(var(--radius) * 0.8)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) * 1.4)",
      },
      fontFamily: {
        sans: "var(--font-nunito-sans)",
        display: "var(--font-nunito-sans)",
        heading: "var(--font-nunito-sans)",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgb(198 108 3 / 0.06)",
        xs: "0 1px 3px 0 rgb(198 108 3 / 0.08)",
        sm: "0 1px 3px 0 rgb(198 108 3 / 0.10), 0 1px 2px -1px rgb(198 108 3 / 0.10)",
        DEFAULT: "0 1px 3px 0 rgb(198 108 3 / 0.10), 0 1px 2px -1px rgb(198 108 3 / 0.10)",
        md: "0 4px 6px -1px rgb(198 108 3 / 0.12), 0 2px 4px -2px rgb(198 108 3 / 0.10)",
        lg: "0 10px 15px -3px rgb(198 108 3 / 0.13), 0 4px 6px -4px rgb(198 108 3 / 0.10)",
        xl: "0 20px 25px -5px rgb(198 108 3 / 0.15), 0 8px 10px -6px rgb(198 108 3 / 0.12)",
        "2xl": "0 25px 50px -12px rgb(198 108 3 / 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
