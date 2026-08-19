import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-background flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
