import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/admin/session";

/**
 * Optimistic gate for /admin: signed-out visitors are sent to the login page before any admin page
 * renders. It only reads the cookie; the authoritative check is requireAdmin() in src/lib/admin/auth.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return signedIn ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (!signedIn) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
