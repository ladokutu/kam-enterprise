import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
  return NextResponse.json(hero);
}

export async function PUT(req: NextRequest) {
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
  return NextResponse.json(hero);
}