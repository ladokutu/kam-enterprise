"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Briefcase, Users, Star, RefreshCw } from "lucide-react";
import type { Contact } from "@prisma/client";

type Stats = {
  contactCount: number;
  portfolioCount: number;
  serviceCount: number;
  testimonialCount: number;
  teamCount: number;
};

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchDashboardData() {
    try {
      // Get token from cookie
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const token = cookies["admin_token"];
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const [statsRes, contactsRes] = await Promise.all([
        fetch("/api/dashboard/stats", { headers, cache: "no-store" }),
        fetch("/api/contacts?limit=5", { headers, cache: "no-store" }),
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (contactsRes.ok) {
        setRecentContacts(await contactsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchDashboardData();
  }

  const statItems = stats
    ? [
        { label: "Pesan Masuk", value: stats.contactCount, icon: MessageSquare },
        { label: "Portofolio", value: stats.portfolioCount, icon: Briefcase },
        { label: "Layanan", value: stats.serviceCount, icon: Users },
        { label: "Testimoni", value: stats.testimonialCount, icon: Star },
        { label: "Tim", value: stats.teamCount, icon: Users },
      ]
    : [];

  if (loading)
    return <div className="p-6 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="p-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Memperbarui..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        {statItems.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <stat.icon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Pesan Terbaru</h2>
        </div>
        <div className="divide-y">
          {recentContacts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Belum ada pesan masuk.
            </div>
          ) : (
            recentContacts.map((contact) => (
              <div key={contact.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {contact.email}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                  {contact.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}