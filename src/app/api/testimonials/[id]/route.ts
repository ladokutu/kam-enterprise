import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const testimonial = await prisma.testimonial.update({
    where: { id: parseInt(id) },
    data: {
      clientName: body.clientName,
      company: body.company || "",
      message: body.message,
      rating: body.rating || 5,
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(testimonial);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
