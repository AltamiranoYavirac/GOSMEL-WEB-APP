import { RegisterForm } from "@/features/register";
import { AppImages } from "@/shared/config";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

export const metadata = {
  title: "Registro",
  description: "Únete a GOSMEL y empieza tu camino musical.",
};

export default function RegisterPage() {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel
        image={AppImages.AUTH_REGISTER}
        imageAlt="Estudiante de canto en una clase de GOSMEL"
        quote="La música comienza donde las palabras terminan."
      />
      <RegisterForm />
    </div>
  );
}
