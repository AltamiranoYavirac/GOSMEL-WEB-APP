import { getPublicSiteAssets } from "@/entities/site-asset";
import { LoginForm } from "@/features/login";
import { AppImages } from "@/shared/config";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

const LOGIN_IMAGE_ALT = "Estudiantes de GOSMEL agradeciendo al público al final de un concierto";

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
  const { data: assets, error: assetsError } = await getPublicSiteAssets();
  const asset = assets?.auth_login;
  const image = asset
    ? buildCloudinaryImageUrl(asset.publicId, "ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto")
    : assetsError
      ? AppImages.AUTH_LOGIN
      : null;

  return (
    <div className={`grid flex-1 ${image ? "lg:grid-cols-2" : ""}`}>
      {image ? (
        <AuthSidePanel
          image={image}
          imageAlt={asset?.alt || LOGIN_IMAGE_ALT}
          quote="Lo bello de la teoría en la práctica."
        />
      ) : null}
      <LoginForm
        nextPath={nextPath}
        notice={reason === "inactive" ? "Tu cuenta está desactivada. Contacta a la academia para solicitar acceso." : undefined}
      />
    </div>
  );
}
