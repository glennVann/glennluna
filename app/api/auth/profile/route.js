import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../_backend";

export async function PUT(request) {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const response = await fetch(`${authApiUrl}/api/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = result.errors
        ? Object.values(result.errors).flat().join(" ")
        : "Unable to update the profile.";
      return NextResponse.json({ error }, { status: response.status });
    }

    return NextResponse.json({ user: result });
  } catch {
    return NextResponse.json({ error: "The profile service is unavailable." }, { status: 502 });
  }
}
