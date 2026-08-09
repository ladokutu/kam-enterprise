import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const [contactCount, portfolioCount, serviceCount, testimonialCount] =
      await Promise.all([
        prisma.contact.count(),
        prisma.portfolio.count(),
        prisma.service.count(),
        prisma.testimonial.count(),
      ]);

    return NextResponse.json({
      contactCount,
      portfolioCount,
      serviceCount,
      testimonialCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik." },
      { status: 500 }
    );
  }
}