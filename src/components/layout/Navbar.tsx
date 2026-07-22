"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Monitor } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/services", label: "Layanan" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

interface AboutData {
  brandName?: string;
  logoUrl?: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch(() => {});
  }, []);

  const brandLabel = about?.brandName || "KAM Enterprise";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          {about?.logoUrl ? (
            <img src={about.logoUrl} alt={brandLabel} className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
          ) : null}
          <Monitor className={`h-6 w-6 text-primary ${about?.logoUrl ? 'hidden' : ''}`} />
          <span>{brandLabel}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Hubungi Kami
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            onClick={() => setMobileOpen(false)}
          >
            Hubungi Kami
          </Link>
        </div>
      )}
    </header>
  );
}