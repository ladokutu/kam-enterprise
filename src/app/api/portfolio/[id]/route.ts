import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

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

  revalidatePath("/");
  revalidatePath("/portfolio");

  return NextResponse.json({
    ...item,
    techStack: typeof item.techStack === "string" ? JSON.parse(item.techStack) : item.techStack,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  await prisma.portfolio.delete({ where: { id: parseInt(id) } });
  revalidatePath("/");
  revalidatePath("/portfolio");
  return NextResponse.json({ ok: true });
}