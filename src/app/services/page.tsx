import { prisma } from "@/lib/prisma";
import { Code2, Brain, Server, CheckCircle } from "lucide-react";
import type { Service } from "@prisma/client";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-10 w-10 text-primary" />,
  Brain: <Brain className="h-10 w-10 text-primary" />,
  Server: <Server className="h-10 w-10 text-primary" />,
};

export const metadata = {
  title: "Layanan | KAM Enterprise",
  description: "Layanan pengembangan aplikasi, konsultasi IT, dan setup server & network dari KAM Enterprise.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan Kami</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Solusi lengkap untuk kebutuhan teknologi informasi perusahaan Anda
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          {services.map((service: Service, index: number) => {
            const features = JSON.parse(service.features || "[]");
            const isReversed = index % 2 === 1;
            return (
              <div
                key={service.id}
                className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="mb-4">
                    {iconMap[service.icon] || <Code2 className="h-10 w-10 text-primary" />}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground text-lg mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  {service.imageUrl ? (
                    <div className="rounded-xl border overflow-hidden aspect-video">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border bg-muted/50 aspect-video flex items-center justify-center">
                      {iconMap[service.icon] || <Code2 className="h-20 w-20 text-primary/30" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Konsultasi?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk mendiskusikan kebutuhan IT perusahaan Anda.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 font-medium shadow hover:bg-accent transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
    </>
  );
}