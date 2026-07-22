import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin") && !isOnLogin;
  const isLoggedIn = !!req.auth;

  // If on admin (not login) and no token → redirect to login
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If on login page and has token → redirect to admin dashboard
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
