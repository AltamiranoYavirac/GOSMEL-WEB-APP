import { LoginForm } from "@/features/login";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

export const metadata = {
  title: "Iniciar Sesión",
  description: "Accede a tu estudio en GOSMEL Academia de Música.",
};

export default function LoginPage() {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel />
      <LoginForm />
    </div>
  );
}
