import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const items = await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const item = await prisma.portfolio.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl || body.image || "",
      techStack: typeof body.techStack === "string" ? body.techStack : JSON.stringify(body.techStack || []),
      link: body.link || body.url || "",
      featured: body.featured || false,
      order: body.order || 0,
    },
  });
  revalidatePath("/");
  revalidatePath("/portfolio");
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const item = await prisma.portfolio.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl || body.image || "",
      techStack: typeof body.techStack === "string" ? body.techStack : JSON.stringify(body.techStack || []),
      link: body.link || body.url || "",
      featured: body.featured || false,
      order: body.order || 0,
    },
  });
  revalidatePath("/");
  revalidatePath("/portfolio");
  return NextResponse.json(item);
}