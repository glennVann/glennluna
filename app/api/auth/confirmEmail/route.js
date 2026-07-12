import { NextResponse } from "next/server";
import { authApiUrl } from "../_backend";

export async function GET(request) {
  const publicAppUrl = process.env.PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectTo = (status) => new URL(`/?emailConfirmed=${status}`, publicAppUrl);
  const userId = request.nextUrl.searchParams.get("userId");
  const code = request.nextUrl.searchParams.get("code");

  if (!userId || !code) {
    return NextResponse.redirect(redirectTo("invalid"));
  }

  try {
    const query = new URLSearchParams({ userId, code });
    const response = await fetch(`${authApiUrl}/api/auth/confirmEmail?${query}`, {
      cache: "no-store",
    });

    return NextResponse.redirect(redirectTo(response.ok ? "true" : "invalid"));
  } catch {
    return NextResponse.redirect(redirectTo("unavailable"));
  }
}
