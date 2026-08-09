import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  let hero = await prisma.hero.findFirst();
  if (!hero) {
    hero = await prisma.hero.create({
      data: {
        headline: "Solusi Digital untuk Bisnis Anda",
        subheadline: "Kami membantu perusahaan Anda bertransformasi secara digital dengan solusi teknologi terbaik.",
        ctaText: "Hubungi Kami",
        ctaLink: "/contact",
      },
    });
  }
  revalidatePath("/");
  return NextResponse.json(hero);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  let hero = await prisma.hero.findFirst();
  if (!hero) {
    hero = await prisma.hero.create({ data: body });
  } else {
    hero = await prisma.hero.update({
      where: { id: hero.id },
      data: {
        headline: body.headline,
        subheadline: body.subheadline,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        imageUrl: body.imageUrl || "",
      },
    });
  }
  revalidatePath("/");
  return NextResponse.json(hero);
}