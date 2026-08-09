import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

const defaultSettings: Record<string, string> = {
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

export async function GET() {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = { ...defaultSettings };
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const updates = Object.entries(body) as [string, string][];

  for (const [key, value] of updates) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = { ...defaultSettings };
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return NextResponse.json(result);
}