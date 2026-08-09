import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio || "",
      imageUrl: body.imageUrl || "",
      order: body.order || 0,
    },
  });
  revalidatePath("/about");
  return NextResponse.json(member, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const member = await prisma.teamMember.update({
    where: { id: body.id },
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio || "",
      imageUrl: body.imageUrl || "",
      order: body.order || 0,
    },
  });
  revalidatePath("/about");
  return NextResponse.json(member);
}