"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type HeroData = {
  id: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
};

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchHero(); }, []);

  async function fetchHero() {
    const res = await fetch("/api/hero");
    const data = await res.json();
    setHero(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!hero) return;
    const res = await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;
  if (!hero) return <div className="p-6 text-center text-muted-foreground">Data tidak ditemukan.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Hero Section</h1>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" /> {saved ? "Tersimpan!" : "Simpan"}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Solusi Digital untuk Bisnis Anda" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subheadline</label>
            <textarea value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Kami membantu perusahaan Anda..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Teks Tombol CTA</label>
              <input value={hero.ctaText} onChange={(e) => setHero({ ...hero, ctaText: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Hubungi Kami" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link CTA</label>
              <input value={hero.ctaLink} onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="/contact" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Gambar Hero</label>
            <input value={hero.imageUrl} onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
          </div>
        </div>
      </div>
    </div>
  );
}