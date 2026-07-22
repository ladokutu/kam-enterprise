"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

interface AboutData {
  brandName?: string;
  logoUrl?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function FooterContent() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              {about?.logoUrl ? (
                <img src={about.logoUrl} alt={about.brandName || "KAM Enterprise"} className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
              ) : null}
              <Monitor className={`h-6 w-6 text-primary ${about?.logoUrl ? 'hidden' : ''}`} />
              <span>{about?.brandName || "KAM Enterprise"}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {about?.description
                ? about.description.substring(0, 100) + "..."
                : "Solusi digital terpercaya untuk bisnis Anda."}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Layanan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">Pengembangan Aplikasi</Link></li>
              <li><Link href="/services" className="hover:text-primary">Konsultasi IT</Link></li>
              <li><Link href="/services" className="hover:text-primary">Setup Server & Network</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Perusahaan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="/portfolio" className="hover:text-primary">Portofolio</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Kontak</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Kontak</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {about?.address && <li>{about.address}</li>}
              {about?.phone && <li>{about.phone}</li>}
              {about?.email && <li>{about.email}</li>}
              {!about?.address && !about?.phone && !about?.email && (
                <>
                  <li>Jl. Teknologi No. 123, Jakarta Selatan</li>
                  <li>+62 812-3456-7890</li>
                  <li>info@kamenterprise.com</li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {about?.brandName || "KAM Enterprise"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}