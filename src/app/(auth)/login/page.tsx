import { LoginForm } from "@/features/login";
import { AppImages } from "@/shared/config";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu formación musical en GOSMEL Music Academy.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; reason?: string | string[] }>
}) {
  const params = await searchParams
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next
  const reason = Array.isArray(params.reason) ? params.reason[0] : params.reason

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel
        image={AppImages.AUTH_LOGIN}
        imageAlt="Estudiantes de GOSMEL agradeciendo al público al final de un concierto"
        quote="Lo bello de la teoría en la práctica."
      />
      <LoginForm
        nextPath={nextPath}
        notice={reason === "inactive" ? "Tu cuenta está desactivada. Contacta a la academia para solicitar acceso." : undefined}
      />
    </div>
  );
}
