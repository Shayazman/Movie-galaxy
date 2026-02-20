import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function isProActive(req: NextRequest): Promise<boolean> {
  try {
    const url = new URL("/api/auth/pro-status", req.url);
    const res = await fetch(url, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const body = (await res.json()) as { proActive?: boolean };
    return Boolean(body.proActive);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
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

  if (pathname.startsWith("/galaxy-picks")) {
    const hasSessionCookie =
      Boolean(req.cookies.get("next-auth.session-token")?.value) ||
      Boolean(req.cookies.get("__Secure-next-auth.session-token")?.value);

    if (!hasSessionCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const active = await isProActive(req);
    if (!active) {
      const url = req.nextUrl.clone();
      url.pathname = "/premium";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/galaxy-picks/:path*"],
};
