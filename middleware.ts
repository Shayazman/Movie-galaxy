import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  const needsAdmin =
    (pathname.startsWith("/admin") && !isAdminLoginPage) ||
    (pathname.startsWith("/api/admin") && !isLoginApi);

  if (needsAdmin) {
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
