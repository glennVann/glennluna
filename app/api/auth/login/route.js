import { NextResponse } from "next/server";
import { accessCookie, authApiUrl, cookieOptions, refreshCookie } from "../_backend";
import { verifyTurnstileRequest } from "../_turnstile";

export async function POST(request) {
  try {
    const { email, password, turnstileToken } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const turnstileError = await verifyTurnstileRequest(request, turnstileToken);
    if (turnstileError) return turnstileError;

    const loginResponse = await fetch(`${authApiUrl}/api/auth/login?useCookies=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!loginResponse.ok) {
      return NextResponse.json({ error: "Invalid credentials or the email address has not been confirmed." }, { status: 401 });
    }
    const tokens = await loginResponse.json();
    const meResponse = await fetch(`${authApiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
      cache: "no-store",
    });
    if (!meResponse.ok) return NextResponse.json({ error: "Unable to load the account." }, { status: 502 });
    const response = NextResponse.json({ user: await meResponse.json() });
    response.cookies.set(accessCookie, tokens.accessToken, { ...cookieOptions, maxAge: tokens.expiresIn });
    response.cookies.set(refreshCookie, tokens.refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 14 });
    return response;
  } catch {
    return NextResponse.json({ error: "The authentication service is unavailable." }, { status: 502 });
  }
}
