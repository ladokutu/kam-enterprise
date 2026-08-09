import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function getAuthenticatedUser(req: NextRequest) {
  // Try to get JWT token from Authorization header first
  const authHeader = req.headers.get("authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      
      return {
        id: decoded.userId.toString(),
        email: decoded.email,
        name: "",
      };
    } catch (error) {
      // Invalid JWT token, fall through to NextAuth
    }
  }

  // Fallback to NextAuth session (cookies)
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!session) {
    return null;
  }

  return {
    id: session.id as string,
    email: session.email as string,
    name: session.name as string,
  };
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "Unauthorized. Please login to continue." },
    { status: 401 }
  );
}

export function forbiddenResponse() {
  return Response.json(
    { error: "Forbidden. You don't have permission to access this resource." },
    { status: 403 }
  );
}