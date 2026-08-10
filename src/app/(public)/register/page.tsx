import { RegisterForm } from "@/features/register";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export const metadata = {
  title: "Registro",
  description: "Únete a la élite musical. Crea tu cuenta en GOSMEL.",
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 pt-28 pb-16 flex items-center justify-center">
        <RegisterForm />
      </main>

      <Footer />
    </>
  );
}