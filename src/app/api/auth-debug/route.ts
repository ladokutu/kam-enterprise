import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  
  // List all cookies
  const cookies = req.cookies.getAll().map(c => ({
    name: c.name,
    value: c.value.substring(0, 20) + "...",
  }));

  // Try different cookie names
  const token1 = await getToken({ req, secret: secret || "" });
  const token2 = await getToken({ req, secret: secret || "", salt: "" });
  const token3 = await getToken({ req, secret: secret || "", salt: "authjs.session-token" });

  return NextResponse.json({
    protocol: req.nextUrl.protocol,
    host: req.nextUrl.host,
    cookies,
    hasToken1: !!token1,
    hasToken2: !!token2,
    hasToken3: !!token3,
    token1User: token1 ? { email: (token1 as Record<string, unknown>).email } : null,
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}