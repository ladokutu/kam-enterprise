import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function validateJWT(token: string | undefined): boolean {
  if (!token) return false;
  
  try {
    // Decode without verifying to check if it's a valid JWT format
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== "object") return false;
    
    // Check expiration
    const payload = decoded as { exp?: number; userId?: number; email?: string };
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin") && !isOnLogin;
  
  // Get JWT token from cookie
  const token = req.cookies.get("adminToken")?.value;
  const isLoggedIn = validateJWT(token);

  console.log(`[Middleware] ${pathname} | isLoggedIn: ${isLoggedIn}`);

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
