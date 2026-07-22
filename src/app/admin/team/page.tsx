"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    const res = await fetch("/api/team");
    setMembers(await res.json());
    setLoading(false);
  }

  function handleNew() {
    setEditing({ id: 0, name: "", role: "", bio: "", imageUrl: "", order: members.length });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    const url = isNew ? "/api/team" : `/api/team/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { setEditing(null); setIsNew(false); fetchMembers(); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus?")) return;
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (res.ok) fetchMembers();
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Tim</h1>
        {!editing && (
          <button onClick={handleNew} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Tambah
          </button>
        )}
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{isNew ? "Tambah Anggota Baru" : "Edit Anggota"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jabatan</label>
              <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="CEO, CTO, dll." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Foto</label>
              <input value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urutan</label>
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-4 w-4" /> Simpan</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Batal</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.role}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing({ ...member }); setIsNew(false); }} className="p-2 hover:bg-muted rounded-md"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-md"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}