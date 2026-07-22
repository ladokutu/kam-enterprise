"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";

type Testimonial = {
  id: number;
  clientName: string;
  company: string;
  message: string;
  rating: number;
  imageUrl: string;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
    setLoading(false);
  }

  function handleNew() {
    setEditing({ id: 0, clientName: "", company: "", message: "", rating: 5, imageUrl: "" });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    const url = isNew ? "/api/testimonials" : `/api/testimonials/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { setEditing(null); setIsNew(false); fetchItems(); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Testimoni</h1>
        {!editing && (
          <button onClick={handleNew} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Tambah
          </button>
        )}
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{isNew ? "Tambah Testimoni Baru" : "Edit Testimoni"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Klien</label>
              <input value={editing.clientName} onChange={(e) => setEditing({ ...editing, clientName: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Perusahaan</label>
              <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Pesan</label>
              <textarea value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Foto</label>
              <input value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
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
              <div className="font-medium">{item.clientName}</div>
              <div className="text-sm text-muted-foreground">{item.company}</div>
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.message}</div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-2 hover:bg-muted rounded-md"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-md"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}