import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Optimistic check — not a security boundary.
  // Real auth checks happen in the page/route handler.
  if (!sessionCookie) {
    const protectedPaths = ["/account"];
    const isProtected = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );

    if (isProtected) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
