import { RegisterForm } from "@/features/register";

export const metadata = {
  title: "Registro",
  description: "Únete a la élite musical. Crea tu cuenta en GOSMEL.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 px-4 pt-28 pb-16 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}