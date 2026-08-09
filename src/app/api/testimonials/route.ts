import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const item = await prisma.testimonial.create({
    data: {
      clientName: body.clientName,
      company: body.company || "",
      message: body.message,
      rating: body.rating || 5,
      imageUrl: body.imageUrl || "",
    },
  });
  revalidatePath("/");
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const item = await prisma.testimonial.update({
    where: { id: body.id },
    data: {
      clientName: body.clientName,
      company: body.company || "",
      message: body.message,
      rating: body.rating || 5,
      imageUrl: body.imageUrl || "",
    },
  });
  revalidatePath("/");
  return NextResponse.json(item);
}