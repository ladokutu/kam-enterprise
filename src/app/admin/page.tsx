"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardClient from "./dashboard-client";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return <AdminDashboardClient />;
}
