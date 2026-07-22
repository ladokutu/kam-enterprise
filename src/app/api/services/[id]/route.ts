import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const features = Array.isArray(body.features) ? body.features : [];

  const item = await prisma.service.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      description: body.description || "",
      icon: body.icon || "Monitor",
      imageUrl: body.imageUrl || "",
      features: JSON.stringify(features),
      order: body.order ?? 0,
    },
  });

  return NextResponse.json({
    ...item,
    features: typeof item.features === "string" ? JSON.parse(item.features) : item.features,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.service.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
