import { getPublicSiteAssets } from "@/entities/site-asset";
import { RegisterForm } from "@/features/register";
import { AppImages } from "@/shared/config";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { AuthSidePanel } from "@/widgets/AuthSidePanel";

const REGISTER_IMAGE_ALT = "Estudiante de canto en una clase de GOSMEL";

export const metadata = {
  title: "Registro",
  description: "Únete a GOSMEL y empieza tu camino musical.",
};

export default async function RegisterPage() {
  const { data: assets, error: assetsError } = await getPublicSiteAssets();
  const asset = assets?.auth_register;
  const image = asset
    ? buildCloudinaryImageUrl(asset.publicId, "ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto")
    : assetsError
      ? AppImages.AUTH_REGISTER
      : null;

  return (
    <div className={`grid flex-1 ${image ? "lg:grid-cols-2" : ""}`}>
      {image ? (
        <AuthSidePanel
          image={image}
          imageAlt={asset?.alt || REGISTER_IMAGE_ALT}
          quote="La música comienza donde las palabras terminan."
        />
      ) : null}
      <RegisterForm />
    </div>
  );
}
