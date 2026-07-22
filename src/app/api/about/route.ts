import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  let about = await prisma.about.findFirst();
  if (!about) {
    about = await prisma.about.create({
      data: {
        companyName: "TechVision",
        brandName: "KAM Enterprise",
        description: "Perusahaan IT yang berfokus pada solusi digital inovatif.",
        vision: "Menjadi perusahaan teknologi terdepan di Indonesia.",
        mission: "Memberikan solusi digital terbaik untuk bisnis Anda.",
      },
    });
  }
  return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  let about = await prisma.about.findFirst();
  if (!about) {
    about = await prisma.about.create({ data: body });
  } else {
    about = await prisma.about.update({
      where: { id: about.id },
      data: {
        companyName: body.companyName,
        brandName: body.brandName || "",
        logoUrl: body.logoUrl || "",
        description: body.description,
        vision: body.vision,
        mission: body.mission,
        imageUrl: body.imageUrl || "",
        address: body.address || "",
        latitude: body.latitude || "",
        longitude: body.longitude || "",
        phone: body.phone || "",
        email: body.email || "",
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  return NextResponse.json(about);
}