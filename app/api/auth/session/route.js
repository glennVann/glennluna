import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../_backend";

export async function GET() {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return NextResponse.json({ authenticated: false });
  try {
    const response = await fetch(`${authApiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const result = NextResponse.json({ authenticated: false });
      result.cookies.delete(accessCookie);
      return result;
    }
    return NextResponse.json({ authenticated: true, user: await response.json() });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}
