"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";

type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  cardBackground: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  darkMode: string;
};

const defaultTheme: ThemeSettings = {
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  backgroundColor: "#ffffff",
  foregroundColor: "#171717",
  mutedColor: "#f5f5f5",
  cardBackground: "#ffffff",
  fontFamily: "Inter",
  headingFont: "Inter",
  borderRadius: "0.5rem",
  darkMode: "false",
};

const fontOptions = [
  "Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Montserrat",
  "Nunito", "Raleway", "Source Sans Pro", "Work Sans", "DM Sans",
  "Plus Jakarta Sans", "Manrope", "Outfit", "Space Grotesk",
];

const radiusOptions = [
  { label: "Tumpul", value: "0.25rem" },
  { label: "Normal", value: "0.5rem" },
  { label: "Bulat", value: "0.75rem" },
  { label: "Sangat Bulat", value: "1rem" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/settings", {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    setSettings(data);
    setLoading(false);
  }

  async function handleSave() {
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers,
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSaved(true);
      // Dispatch event to update ThemeProvider live
      window.dispatchEvent(new CustomEvent("theme-updated", { detail: settings }));
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function handleReset() {
    setSettings(defaultTheme);
    window.dispatchEvent(new CustomEvent("theme-updated", { detail: defaultTheme }));
  }

  function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 rounded-md border cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Tema</h1>
        <div className="flex gap-2">
          <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" /> {saved ? "Tersimpan!" : "Simpan"}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Colors */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">🎨 Warna</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ColorInput label="Warna Utama" value={settings.primaryColor} onChange={(v) => setSettings({ ...settings, primaryColor: v })} />
            <ColorInput label="Warna Sekunder" value={settings.secondaryColor} onChange={(v) => setSettings({ ...settings, secondaryColor: v })} />
            <ColorInput label="Warna Aksen" value={settings.accentColor} onChange={(v) => setSettings({ ...settings, accentColor: v })} />
            <ColorInput label="Warna Latar" value={settings.backgroundColor} onChange={(v) => setSettings({ ...settings, backgroundColor: v })} />
            <ColorInput label="Warna Teks" value={settings.foregroundColor} onChange={(v) => setSettings({ ...settings, foregroundColor: v })} />
            <ColorInput label="Warna Muted" value={settings.mutedColor} onChange={(v) => setSettings({ ...settings, mutedColor: v })} />
            <ColorInput label="Warna Kartu" value={settings.cardBackground} onChange={(v) => setSettings({ ...settings, cardBackground: v })} />
          </div>
          {/* Preview */}
          <div className="mt-4 rounded-lg p-4 border" style={{ backgroundColor: settings.backgroundColor, color: settings.foregroundColor }}>
            <div className="flex gap-2 mb-2">
              <span className="px-3 py-1 rounded text-white text-xs" style={{ backgroundColor: settings.primaryColor }}>Primary</span>
              <span className="px-3 py-1 rounded text-white text-xs" style={{ backgroundColor: settings.secondaryColor }}>Secondary</span>
              <span className="px-3 py-1 rounded text-white text-xs" style={{ backgroundColor: settings.accentColor }}>Accent</span>
            </div>
            <p className="text-sm" style={{ color: settings.foregroundColor }}>Ini adalah contoh tampilan teks dengan warna yang dipilih.</p>
          </div>
        </div>

        {/* Typography */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">✏️ Tipografi</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Teks</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <p className="text-xs text-muted-foreground mt-1 mt-1" style={{ fontFamily: settings.fontFamily }}>Preview: The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Heading</label>
              <select
                value={settings.headingFont}
                onChange={(e) => setSettings({ ...settings, headingFont: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <p className="text-xs text-muted-foreground mt-1 mt-1" style={{ fontFamily: settings.headingFont, fontSize: "1.25rem", fontWeight: "bold" }}>Preview Heading</p>
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">📐 Border Radius</h2>
          <div className="grid grid-cols-4 gap-3">
            {radiusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSettings({ ...settings, borderRadius: opt.value })}
                className={`p-4 border-2 text-center text-sm transition-colors ${
                  settings.borderRadius === opt.value ? "border-primary bg-primary/5" : "border-input hover:border-muted-foreground"
                }`}
                style={{ borderRadius: opt.value }}
              >
                <div className="w-full h-8 bg-primary mb-2" style={{ borderRadius: opt.value }}></div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">👁️ Preview Langsung</h2>
          <div
            className="rounded-lg p-6 border space-y-3"
            style={{
              backgroundColor: settings.backgroundColor,
              color: settings.foregroundColor,
              borderRadius: settings.borderRadius,
              fontFamily: settings.fontFamily,
            }}
          >
            <h3 style={{ fontFamily: settings.headingFont, fontSize: "1.5rem", fontWeight: "bold" }}>Judul Contoh</h3>
            <p className="text-sm">Ini adalah contoh tampilan website dengan pengaturan tema yang Anda pilih. Perubahan akan terlihat secara langsung di website utama.</p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-white text-sm font-medium"
                style={{ backgroundColor: settings.primaryColor, borderRadius: settings.borderRadius }}
              >
                Tombol Utama
              </button>
              <button
                className="px-4 py-2 text-white text-sm font-medium"
                style={{ backgroundColor: settings.secondaryColor, borderRadius: settings.borderRadius }}
              >
                Tombol Sekunder
              </button>
            </div>
            <div
              className="p-3 border"
              style={{ borderColor: settings.mutedColor, backgroundColor: settings.cardBackground, borderRadius: settings.borderRadius }}
            >
              <p className="text-sm font-medium">Ini adalah contoh kartu dengan warna latar yang dipilih.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}