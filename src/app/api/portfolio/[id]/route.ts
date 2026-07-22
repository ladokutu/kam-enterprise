import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const techStack = Array.isArray(body.techStack) ? body.techStack : [];

  const item = await prisma.portfolio.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      description: body.description || "",
      category: body.category || "",
      imageUrl: body.imageUrl || "",
      techStack: JSON.stringify(techStack),
      link: body.link || "",
      featured: body.featured ?? false,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json({
    ...item,
    techStack: typeof item.techStack === "string" ? JSON.parse(item.techStack) : item.techStack,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.portfolio.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
