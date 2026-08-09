"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, EyeOff, Mail } from "lucide-react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => { fetchContacts(); }, []);

  async function fetchContacts() {
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/contacts", {
      headers,
      cache: "no-store",
    });
    setContacts(await res.json());
    setLoading(false);
  }

  async function markRead(id: number) {
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isRead: true }),
    });
    fetchContacts();
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus?")) return;
    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
      headers,
    });
    setSelected(null);
    fetchContacts();
  }

  if (loading) return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pesan Masuk</h1>

      <div className="space-y-3">
        {contacts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">Belum ada pesan.</div>
        )}
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`rounded-xl border bg-card p-4 cursor-pointer hover:bg-muted/50 transition ${!contact.isRead ? "border-l-4 border-l-primary" : ""}`}
            onClick={() => { setSelected(contact); markRead(contact.id); }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className={`h-5 w-5 ${!contact.isRead ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className="font-medium">{contact.name} {!contact.isRead && <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full ml-1">Baru</span>}</div>
                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(contact.createdAt).toLocaleDateString("id-ID")}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{contact.message}</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Detail Pesan</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="space-y-3">
              <div><span className="text-sm font-medium">Nama:</span> <span className="text-sm">{selected.name}</span></div>
              <div><span className="text-sm font-medium">Email:</span> <span className="text-sm">{selected.email}</span></div>
              {selected.phone && <div><span className="text-sm font-medium">Telepon:</span> <span className="text-sm">{selected.phone}</span></div>}
              {selected.service && <div><span className="text-sm font-medium">Layanan:</span> <span className="text-sm">{selected.service}</span></div>}
              <div><span className="text-sm font-medium">Tanggal:</span> <span className="text-sm">{new Date(selected.createdAt).toLocaleString("id-ID")}</span></div>
              <div className="border-t pt-3">
                <span className="text-sm font-medium">Pesan:</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Mail className="h-4 w-4" /> Balas Email
              </a>
              <button onClick={() => handleDelete(selected.id)} className="inline-flex items-center gap-2 rounded-md border border-destructive text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}