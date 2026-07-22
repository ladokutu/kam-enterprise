import { prisma } from "@/lib/prisma";
import { MessageSquare, Briefcase, Users, Star } from "lucide-react";
import type { Contact } from "@/generated/prisma/client";

export const metadata = {
  title: "Admin Dashboard | KAM Enterprise",
};

export default async function AdminDashboard() {
  const [contactCount, portfolioCount, serviceCount, testimonialCount] =
    await Promise.all([
      prisma.contact.count(),
      prisma.portfolio.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
    ]);

  const recentContacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Pesan Masuk", value: contactCount, icon: MessageSquare },
    { label: "Portofolio", value: portfolioCount, icon: Briefcase },
    { label: "Layanan", value: serviceCount, icon: Users },
    { label: "Testimoni", value: testimonialCount, icon: Star },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <stat.icon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Pesan Terbaru</h2>
        </div>
        <div className="divide-y">
          {recentContacts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Belum ada pesan masuk.
            </div>
          ) : (
            recentContacts.map((contact: Contact) => (
              <div key={contact.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {contact.email}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                  {contact.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}