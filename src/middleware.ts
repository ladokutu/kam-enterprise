// No-op middleware - authentication is handled by JWT in API routes
import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}
