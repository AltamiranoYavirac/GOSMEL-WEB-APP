import { LoginForm } from "@/features/login";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8f6ef] dark:bg-neutral-950 px-4 pt-28 pb-16 flex items-center justify-center">
        <LoginForm />
      </main>

      <Footer />
    </>
  );
}