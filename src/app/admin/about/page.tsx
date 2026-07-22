"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type AboutData = {
  id: number;
  companyName: string;
  brandName: string;
  logoUrl: string;
  vision: string;
  mission: string;
  description: string;
  imageUrl: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
};

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchAbout(); }, []);

  async function fetchAbout() {
    const res = await fetch("/api/about");
    const data = await res.json();
    setAbout(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!about) return;
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;
  if (!about) return <div className="p-6 text-center text-muted-foreground">Data tidak ditemukan.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Tentang Kami</h1>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" /> {saved ? "Tersimpan!" : "Simpan"}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 max-w-2xl">
        <div className="space-y-4">
          {/* Brand & Logo Section */}
          <div className="pb-4 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Brand & Logo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Brand</label>
                <input value={about.brandName} onChange={(e) => setAbout({ ...about, brandName: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Contoh: KAM Enterprise" />
                <p className="text-xs text-muted-foreground mt-1">Nama brand yang tampil di navbar dan footer website</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Logo</label>
                <input value={about.logoUrl} onChange={(e) => setAbout({ ...about, logoUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
                <p className="text-xs text-muted-foreground mt-1">URL gambar logo yang tampil di navbar dan footer</p>
              </div>
              {about.logoUrl && (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md border bg-background flex items-center justify-center overflow-hidden">
                    <img src={about.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Preview Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="pb-4 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Deskripsi</h2>
            <div>
              <textarea value={about.description} onChange={(e) => setAbout({ ...about, description: e.target.value })} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="pb-4 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Visi & Misi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Visi</label>
                <textarea value={about.vision} onChange={(e) => setAbout({ ...about, vision: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Misi</label>
                <textarea value={about.mission} onChange={(e) => setAbout({ ...about, mission: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Image & Contact */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Gambar & Kontak</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar Profil</label>
                <input value={about.imageUrl} onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <input value={about.address} onChange={(e) => setAbout({ ...about, address: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input value={about.latitude} onChange={(e) => setAbout({ ...about, latitude: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="-6.2088" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input value={about.longitude} onChange={(e) => setAbout({ ...about, longitude: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="106.8456" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Telepon</label>
                  <input value={about.phone} onChange={(e) => setAbout({ ...about, phone: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input value={about.email} onChange={(e) => setAbout({ ...about, email: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              {/* Map Preview */}
              {about.latitude && about.longitude && (
                <div>
                  <label className="block text-sm font-medium mb-1">Preview Peta</label>
                  <div className="rounded-md overflow-hidden border">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(about.longitude) - 0.01},${parseFloat(about.latitude) - 0.01},${parseFloat(about.longitude) + 0.01},${parseFloat(about.latitude) + 0.01}&layer=mapnik&marker=${about.latitude},${about.longitude}`}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Koordinat: {about.latitude}, {about.longitude}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}