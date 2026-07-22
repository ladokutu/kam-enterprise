import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings] = await Promise.all([
    prisma.about.findFirst(),
    prisma.setting.findMany(),
  ]);
  const get = (key: string) => settings.find((s) => s.key === key)?.value;

  const brandName = about?.brandName || get("company_name") || "KAM Enterprise";
  const description =
    about?.description ||
    get("company_description") ||
    "Perusahaan IT yang berfokus pada pengembangan aplikasi, konsultasi IT, dan setup server & network.";

  return {
    title: `${brandName} | Solusi Digital Terpercaya`,
    description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
