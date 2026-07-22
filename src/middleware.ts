import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return NextResponse.next();

  // NextAuth v5 uses different cookie names:
  // HTTP (localhost): "authjs.session-token"
  // HTTPS (Vercel): "__Secure-authjs.session-token"
  const isHttps = req.nextUrl.protocol === "https:";
  const salt = isHttps ? "__Secure-" : "";

  const token = await getToken({ req, secret, salt });

  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin") && !isOnLogin;

  if (isOnAdmin && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isOnLogin && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
