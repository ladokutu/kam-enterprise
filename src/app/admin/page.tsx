import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | KAM Enterprise",
};

import AdminDashboardClient from "./dashboard-client";

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}