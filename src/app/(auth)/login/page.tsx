import { LoginForm } from "@/features/login";
import { AppImages } from "@/shared/config";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu formación musical en GOSMEL Music Academy.",
};

export default function LoginPage() {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel
        image={AppImages.AUTH_LOGIN}
        imageAlt="Estudiantes de GOSMEL agradeciendo al público al final de un concierto"
        quote="Lo bello de la teoría en la práctica."
      />
      <LoginForm />
    </div>
  );
}
