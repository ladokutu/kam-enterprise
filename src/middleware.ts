import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin") && !isOnLogin;

  // If on admin (not login) and no token → redirect to login
  if (isOnAdmin && !token) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If on login page and has token → redirect to admin dashboard
  if (isOnLogin && token) {
    const adminUrl = new URL("/admin", req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
