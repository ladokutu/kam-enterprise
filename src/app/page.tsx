import { prisma } from "@/lib/prisma";
import type { Service, Testimonial } from "@prisma/client";
import { Code2, Brain, Server, ArrowRight, Star, CheckCircle } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-8 w-8 text-primary" />,
  Brain: <Brain className="h-8 w-8 text-primary" />,
  Server: <Server className="h-8 w-8 text-primary" />,
};

export default async function HomePage() {
  const [hero, services, testimonials, about] = await Promise.all([
    prisma.hero.findFirst(),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.about.findFirst(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {hero?.headline || "Solusi Digital Terpercaya untuk Bisnis Anda"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {hero?.subheadline ||
                "KAM Enterprise hadir sebagai partner terpercaya dalam pengembangan aplikasi, konsultasi IT, serta setup server dan network."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={hero?.ctaLink || "/contact"}
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                {hero?.ctaText || "Konsultasi Gratis"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium shadow-sm hover:bg-accent transition-colors"
              >
                Lihat Layanan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk kebutuhan teknologi informasi perusahaan Anda
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service: Service) => {
              const features = JSON.parse(service.features || "[]");
              return (
                <div
                  key={service.id}
                  className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {service.imageUrl ? (
                    <div className="mb-4 rounded-lg overflow-hidden aspect-video">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      {iconMap[service.icon] || <Code2 className="h-8 w-8 text-primary" />}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {features.slice(0, 3).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Lihat Semua Layanan <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            {[
              { label: "Proyek Selesai", value: "50+" },
              { label: "Klien Puas", value: "40+" },
              { label: "Tahun Pengalaman", value: "10+" },
              { label: "Tim Ahli", value: "20+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      {about && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Tentang {about.companyName}</h2>
              <p className="text-lg text-muted-foreground mb-8">{about.description}</p>
              <Link
                href="/about"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Pelajari Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Klien Kami</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((t: Testimonial) => (
                <div key={t.id} className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.message}"</p>
                  <div>
                    <div className="font-semibold">{t.clientName}</div>
                    <div className="text-sm text-muted-foreground">{t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk konsultasi gratis dan temukan solusi terbaik untuk bisnis Anda.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 text-base font-medium shadow hover:bg-accent transition-colors"
          >
            Hubungi Kami Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}