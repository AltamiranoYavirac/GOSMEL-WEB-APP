import { RegisterForm } from "@/features/register";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";
import { AppImages } from "@/shared/config";

export const metadata = {
  title: "Registro",
  description: "Únete a la élite musical. Crea tu cuenta en GOSMEL.",
};

export default function RegisterPage() {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel image={AppImages.WHY_PIANO} quote="La música comienza donde las palabras terminan" />
      <RegisterForm />
    </div>
  );
}
