"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

type AboutData = {
  companyName: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
};

export default function ContactPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitResult({ success: true, message: "Pesan berhasil dikirim! Kami akan segera menghubungi Anda." });
        setFormState({ name: "", email: "", phone: "", company: "", service: "", message: "" });
      } else {
        setSubmitResult({ success: false, message: data.error || "Gagal mengirim pesan." });
      }
    } catch {
      setSubmitResult({ success: false, message: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Siap membantu Anda menemukan solusi digital terbaik
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alamat</h3>
                    <p className="text-muted-foreground">{about?.address || "Belum diatur"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telepon</h3>
                    <p className="text-muted-foreground">{about?.phone || "Belum diatur"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">{about?.email || "Belum diatur"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Jam Kerja</h3>
                    <p className="text-muted-foreground">Senin - Jumat: 09:00 - 18:00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              {about?.latitude && about?.longitude ? (
                <div className="mt-8 rounded-xl overflow-hidden border">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(about.longitude) - 0.01},${parseFloat(about.latitude) - 0.01},${parseFloat(about.longitude) + 0.01},${parseFloat(about.latitude) + 0.01}&layer=mapnik&marker=${about.latitude},${about.longitude}`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Lokasi Kantor"
                  />
                </div>
              ) : (
                <div className="mt-8 rounded-xl border bg-muted/50 aspect-video flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Peta belum tersedia</p>
                    <p className="text-xs">Atur koordinat di admin untuk menampilkan peta</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                      Telepon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1.5">
                      Perusahaan
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="PT. Contoh Indonesia"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-1.5">
                    Layanan yang Diminati
                  </label>
                  <select
                    id="service"
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Pilih Layanan</option>
                    <option value="Pengembangan Aplikasi">Pengembangan Aplikasi</option>
                    <option value="Konsultasi IT">Konsultasi IT</option>
                    <option value="Setup Server & Network">Setup Server & Network</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Ceritakan kebutuhan Anda..."
                  />
                </div>

                {submitResult && (
                  <div
                    className={`rounded-md p-3 text-sm ${
                      submitResult.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitResult.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Mengirim..."
                  ) : (
                    <>
                      Kirim Pesan
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}