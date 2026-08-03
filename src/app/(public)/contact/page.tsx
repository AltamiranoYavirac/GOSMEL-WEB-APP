import { ContactForm, ContactInfo } from "@/features/contact";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";

export const metadata = {
  title: "Contacto | GOSMEL Academia de Música",
  description: "Escríbenos para agendar una clase de prueba o resolver cualquier duda.",
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
            Estamos aquí para acompañarte en tu viaje musical. Escríbenos para agendar una{" "}
            <span className="text-ginger font-medium">clase de prueba</span> o resolver
            cualquier duda sobre nuestros programas.
          </p>
        </section>

        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
          <ContactInfo
            address="Av. de la Armonía 450, Col. Sonata"
            addressDetail="Ciudad de México, CP 01000"
            phone="+52 (55) 1234 5678"
            schedule="Lun - Vie, 9:00 - 20:00"
            emails={["info@gosmel.edu.mx", "admisiones@gosmel.edu.mx"]}
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