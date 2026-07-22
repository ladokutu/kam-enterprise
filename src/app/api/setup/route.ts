import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
        ? `SET (${process.env.NEXTAUTH_URL})`
        : "NOT SET ❌",
      NEXTAUTH_SECRET: process.env.AUTH_SECRET
        ? "SET ✅"
        : process.env.NEXTAUTH_SECRET
          ? "SET (via NEXTAUTH_SECRET) ✅"
          : "NOT SET ❌",
      DATABASE_URL: process.env.DATABASE_URL
        ? "SET ✅"
        : "NOT SET ❌",
    };

    // Test database connection
    const userCount = await prisma.adminUser.count();

    if (userCount > 0) {
      return NextResponse.json({
        status: "ok",
        message: `Database connected. ${userCount} admin user(s) found.`,
        userCount,
        envCheck,
      });
    }

    // No admin users - seed one
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newUser = await prisma.adminUser.create({
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
      userId: newUser.id,
      credentials: {
        email: "admin@kamenterprise.com",
        password: "admin123",
      },
      envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
