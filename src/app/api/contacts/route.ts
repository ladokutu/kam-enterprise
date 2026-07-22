import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(contacts);
}