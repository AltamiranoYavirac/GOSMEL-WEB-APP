export const metadata = {
  title: "Política de Privacidad | GOSMEL Music Academy",
  description:
    "Conoce cómo GOSMEL Music Academy recopila, usa y protege tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Privacidad · GOSMEL
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Última actualización: agosto de 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-muted-foreground">
          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              1. Responsable del tratamiento
            </h2>
            <p className="leading-relaxed">
              GOSMEL Music Academy, con domicilio en Quito, Ecuador, es la responsable del
              tratamiento de los datos personales recopilados a través de este sitio web. Para
              cualquier consulta puedes escribirnos a{" "}
              <span className="text-primary">andymelabur@gmail.com</span>.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              2. Datos que recopilamos
            </h2>
            <p className="leading-relaxed">
              Recopilamos la información que nos proporcionas directamente al crear tu cuenta:
              nombre, apellidos, correo electrónico y número de celular. Cuando usas el inicio de
              sesión con Google o Facebook, también recibimos el nombre y el correo asociado a tu
              cuenta en ese proveedor. Adicionalmente, podemos recopilar datos de uso con fines
              estadísticos y de mejora del servicio.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              3. Finalidad del tratamiento
            </h2>
            <p className="leading-relaxed">
              Tus datos se utilizan para crear y gestionar tu cuenta, procesar tu matrícula y tus
              pagos, enviarte comunicaciones relacionadas con la academia y mejorar nuestros
              servicios. No utilizamos tus datos para fines distintos de los aquí descritos sin
              obtener tu consentimiento previo.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              4. Almacenamiento y protección
            </h2>
            <p className="leading-relaxed">
              Tus datos se almacenan en servidores seguros gestionados por proveedores de
              infraestructura como Supabase y Vercel, con acceso restringido y cifrado en
              tránsito. Aplicamos medidas técnicas y organizativas razonables para proteger tu
              información frente a accesos no autorizados.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              5. Compartir con terceros
            </h2>
            <p className="leading-relaxed">
              No vendemos ni alquilamos tus datos personales. Compartimos información únicamente
              con los proveedores necesarios para operar el servicio (infraestructura, pagos y
              almacenamiento de archivos), siempre bajo las garantías de confidencialidad
              correspondientes.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              6. Tus derechos
            </h2>
            <p className="leading-relaxed">
              Tienes derecho a acceder, rectificar y solicitar la eliminación de tus datos
              personales, así como a oponerte a su tratamiento. Para ejercer estos derechos,
              escríbenos a{" "}
              <span className="text-primary">andymelabur@gmail.com</span> indicando tu solicitud.
              La eliminación de datos incluye el borrado de tu cuenta y de la información asociada,
              salvo la que debamos conservar por obligación legal.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              7. Cambios a esta política
            </h2>
            <p className="leading-relaxed">
              Podemos actualizar esta política periódicamente. Publicaremos cualquier cambio en
              esta página con la fecha de actualización correspondiente. El uso continuado del
              sitio tras los cambios implica la aceptación de la nueva versión.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}