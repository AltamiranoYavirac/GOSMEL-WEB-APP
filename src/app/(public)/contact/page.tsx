import { ContactForm, ContactInfo } from "@/features/contact";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export const metadata = {
  title: "Contacto",
  description: "Escríbenos para solicitar más información o resolver cualquier duda.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8f6ef] dark:bg-neutral-950 px-4 py-16 pt-28">

        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cocoa dark:text-ginger mb-4">
            Contacto
          </h1>
          <p className="text-cocoa/70 dark:text-neutral-300 max-w-xl mx-auto text-sm leading-relaxed">
            Estamos aquí para acompañarte en tu viaje musical. Escríbenos para solicitar{" "}
            <span className="text-ginger font-medium">más información</span> o resolver
            cualquier duda sobre nuestros programas.
          </p>
        </section>

        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
          <ContactInfo
            address="Humberto Albornoz e Ignacio de Quezada"
            addressDetail="Quito - Ecuador"
            phone="+593 98 602 3191"
            emails={["andymelabur@gmail.com"]}
            mapImageUrl="/images/academia-map.jpg"
            mapsUrl="https://maps.google.com"
          />
          <ContactForm />
        </section>

      </main>

      <Footer />
    </>
  );
}