import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const member = await prisma.teamMember.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio || "",
      imageUrl: body.imageUrl || "",
      order: body.order || 0,
    },
  });
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: "Deleted" });
}