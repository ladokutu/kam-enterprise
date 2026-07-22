import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin") && !isOnLogin;
  const isLoggedIn = !!req.auth;

  console.log(`[Middleware] ${pathname} | isLoggedIn: ${isLoggedIn}`);

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
