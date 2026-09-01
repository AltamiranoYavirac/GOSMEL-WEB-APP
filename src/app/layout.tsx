import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/shared/ui";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOSMEL Academia de Música — Lo bello de la teoría en la práctica",
  title: "GOSMEL Academia de Música — Lo bello de la teoría en la práctica",
  description:
    "Academia de música en Quito con siete programas, clases personalizadas y experiencias reales en escenario.",
  "Academia de música en Quito con siete programas, clases personalizadas y experiencias reales en escenario.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${nunitoSans.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-ginger selection:text-cream antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
