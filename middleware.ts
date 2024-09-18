import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = cookies().get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const response = await fetch(`http://localhost:5000/api/verify-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/"]
};
