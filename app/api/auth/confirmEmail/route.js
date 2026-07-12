import { NextResponse } from "next/server";
import { authApiUrl } from "../_backend";

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");
  const code = request.nextUrl.searchParams.get("code");

  if (!userId || !code) {
    return NextResponse.redirect(new URL("/?emailConfirmed=invalid", request.url));
  }

  try {
    const query = new URLSearchParams({ userId, code });
    const response = await fetch(`${authApiUrl}/api/auth/confirmEmail?${query}`, {
      cache: "no-store",
    });

    return NextResponse.redirect(
      new URL(response.ok ? "/?emailConfirmed=true" : "/?emailConfirmed=invalid", request.url),
    );
  } catch {
    return NextResponse.redirect(new URL("/?emailConfirmed=unavailable", request.url));
  }
}
