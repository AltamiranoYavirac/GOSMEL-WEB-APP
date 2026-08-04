import { RegisterForm } from "@/features/register";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8f6ef] dark:bg-neutral-950 px-4 pt-28 pb-16 flex items-center justify-center">
        <RegisterForm />
      </main>

      <Footer />
    </>
  );
}