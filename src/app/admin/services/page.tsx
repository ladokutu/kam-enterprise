"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Save,
  X,
} from "lucide-react";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
  order: number;
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
    fetchServices();
  }, [router]);

  async function fetchServices() {
    try {
      const token = localStorage.getItem("adminToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/services", {
        headers,
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status);
        setServices([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setServices(data.map((s: Service & { features: string | string[] }) => ({
        ...s,
        features: typeof s.features === "string" ? JSON.parse(s.features || "[]") : (s.features || []),
      })));
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    setEditing({
      id: 0,
      title: "",
      description: "",
      icon: "Monitor",
      imageUrl: "",
      features: [],
      order: services.length,
    });
    setIsNew(true);
  }

  function handleEdit(service: Service) {
    setEditing({ ...service });
    setIsNew(false);
  }

  function handleCancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;

    const url = isNew ? "/api/services" : `/api/services/${editing.id}`;
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

    if (res.ok) {
      setEditing(null);
      setIsNew(false);
      fetchServices();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus layanan ini?")) return;

    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) fetchServices();
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Layanan</h1>
        {!editing && (
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </button>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {isNew ? "Tambah Layanan Baru" : "Edit Layanan"}
            </h2>
            <button onClick={handleCancel} className="p-1 hover:bg-muted rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Contoh: Pengembangan Aplikasi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon (Lucide)</label>
              <input
                value={editing.icon}
                onChange={(e) =>
                  setEditing({ ...editing, icon: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Monitor"
              />
              <p className="text-xs text-muted-foreground mt-1">Digunakan sebagai fallback jika gambar tidak ada</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">URL Gambar Layanan</label>
              <input
                value={editing.imageUrl || ""}
                onChange={(e) =>
                  setEditing({ ...editing, imageUrl: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="https://..."
              />
              {editing.imageUrl && (
                <div className="mt-2 rounded-md border overflow-hidden h-40 bg-background flex items-center justify-center">
                  <img src={editing.imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Gambar yang ditampilkan di halaman layanan. Kosongkan untuk menampilkan icon</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Deskripsi layanan..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Fitur (pisahkan dengan koma)
              </label>
              <input
                value={editing.features.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    features: e.target.value.split(",").map((f) => f.trim()),
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Fitur 1, Fitur 2, Fitur 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urutan</label>
              <input
                type="number"
                value={editing.order}
                onChange={(e) =>
                  setEditing({ ...editing, order: parseInt(e.target.value) })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border bg-card p-4 flex items-center gap-4"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <div className="font-medium">{service.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {service.description}
              </div>
              {service.features.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {service.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-xs bg-muted px-2 py-0.5 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(service)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}