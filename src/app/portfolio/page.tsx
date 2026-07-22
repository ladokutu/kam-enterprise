import { prisma } from "@/lib/prisma";
import { ExternalLink } from "lucide-react";
import type { Portfolio } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portofolio | KAM Enterprise",
  description: "Proyek-proyek terbaik yang telah kami kerjakan.",
};

export default async function PortfolioPage() {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(portfolios.map((p: Portfolio) => p.category))] as string[];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portofolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proyek-proyek terbaik yang telah kami kerjakan untuk klien kami
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          {portfolios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Portofolio akan segera tersedia. Kami sedang menyiapkan proyek-proyek terbaik kami untuk ditampilkan.
              </p>
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.map((portfolio: Portfolio) => {
                  const techStack = JSON.parse(portfolio.techStack || "[]");
                  return (
                    <div
                      key={portfolio.id}
                      className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        {portfolio.imageUrl ? (
                          <img
                            src={portfolio.imageUrl}
                            alt={portfolio.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">No Image</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold">{portfolio.title}</h3>
                          {portfolio.link && (
                            <a
                              href={portfolio.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 mb-3">
                          {portfolio.category}
                        </span>
                        <p className="text-sm text-muted-foreground mb-3">{portfolio.description}</p>
                        {techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {techStack.map((tech: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}