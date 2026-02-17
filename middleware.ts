import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginApi = pathname === "/api/admin/login";

  // protect /api/admin only (UI auth is handled client-side for /admin)
  if (!isLoginApi && pathname.startsWith("/api/admin")) {
    const cookie = req.cookies.get("mg_admin")?.value;
    if (cookie !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
