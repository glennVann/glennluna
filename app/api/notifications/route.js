import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../auth/_backend";

export async function GET() {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const response = await fetch(`${authApiUrl}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: body.detail || body.error || "Notifications could not be loaded." },
        { status: response.status },
      );
    }

    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "The notification service is unavailable." },
      { status: 502 },
    );
  }
}
