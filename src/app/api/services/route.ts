import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const service = await prisma.service.create({
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon || "",
      imageUrl: body.imageUrl || "",
      features: JSON.stringify(body.features || []),
      order: body.order || 0,
    },
  });
  return NextResponse.json(service, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const service = await prisma.service.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon || "",
      imageUrl: body.imageUrl || "",
      features: JSON.stringify(body.features || []),
      order: body.order || 0,
    },
  });
  return NextResponse.json(service);
}