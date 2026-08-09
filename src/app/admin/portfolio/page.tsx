"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from "lucide-react";

type Portfolio = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  techStack: string[] | string;
  link: string;
  featured: boolean;
  order: number;
};

function parseTechStack(tech: string[] | string): string[] {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string" && tech) {
    try { return JSON.parse(tech); } catch { return tech.split(",").map(s => s.trim()).filter(Boolean); }
  }
  return [];
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/portfolio", {
      headers,
      cache: "no-store",
    });
    setItems(await res.json());
    setLoading(false);
  }

  function handleNew() {
    setEditing({ id: 0, title: "", description: "", imageUrl: "", category: "", techStack: [], link: "", featured: false, order: items.length });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    const url = isNew ? "/api/portfolio" : `/api/portfolio/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(editing),
    });
    if (res.ok) { setEditing(null); setIsNew(false); fetchItems(); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus?")) return;
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) fetchItems();
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Portofolio</h1>
        {!editing && (
          <button onClick={handleNew} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Tambah
          </button>
        )}
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{isNew ? "Tambah Portofolio Baru" : "Edit Portofolio"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Web App, Mobile App, dll." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Gambar</label>
              <input value={editing.imageUrl ?? ""} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Proyek</label>
              <input value={editing.link ?? ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tech Stack (koma)</label>
              <input value={parseTechStack(editing.techStack).join(", ")} onChange={(e) => setEditing({ ...editing, techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Next.js, React, PostgreSQL" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
              <label className="text-sm font-medium">Featured</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urutan</label>
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-4 w-4" /> Simpan</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Batal</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.title}</span>
                {item.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {parseTechStack(item.techStack).map((t: string, i: number) => (
                  <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              {item.link && <a href={item.link} target="_blank" className="p-2 hover:bg-muted rounded-md"><ExternalLink className="h-4 w-4" /></a>}
              <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-2 hover:bg-muted rounded-md"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-md"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}