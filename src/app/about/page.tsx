import { prisma } from "@/lib/prisma";
import { Target, Eye, Heart } from "lucide-react";
import type { TeamMember } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tentang Kami | KAM Enterprise",
  description: "Kenali lebih dekat KAM Enterprise, visi, misi, dan tim kami.",
};

export default async function AboutPage() {
  const [about, teamMembers, companySetting] = await Promise.all([
    prisma.about.findFirst(),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.setting.findFirst({ where: { key: "company_name" } }),
  ]);

  const brandName = companySetting?.value || "KAM Enterprise";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kenali lebih dekat {brandName}
          </p>
        </div>
      </section>

      {/* Company Profile */}
      {about && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">{brandName}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{about.description}</p>
            </div>

            {/* Vision & Mission */}
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Visi</h3>
                <p className="text-muted-foreground">{about.vision}</p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <Target className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Misi</h3>
                <p className="text-muted-foreground">{about.mission}</p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Nilai Kami</h3>
                <p className="text-muted-foreground">Inovasi, Integritas, dan Kolaborasi</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Kami</h2>
              <p className="text-muted-foreground">Para profesional berpengalaman di bidangnya</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member: TeamMember) => (
                <div key={member.id} className="rounded-xl border bg-card p-6 shadow-sm text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-muted-foreground">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Bergabung dengan Kami?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Kami selalu mencari talenta terbaik untuk bergabung dengan tim kami.
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