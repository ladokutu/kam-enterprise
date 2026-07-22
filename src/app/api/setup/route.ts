import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.adminUser.count();

    if (userCount > 0) {
      return NextResponse.json({
        status: "ok",
        message: `Database connected. ${userCount} admin user(s) found.`,
        userCount,
      });
    }

    // No admin users - seed one
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.adminUser.create({
      data: {
        name: "Admin KAM Enterprise",
        email: "admin@kamenterprise.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      status: "seeded",
      message: "Admin user created successfully!",
      credentials: {
        email: "admin@kamenterprise.com",
        password: "admin123",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}