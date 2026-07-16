import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../../../../auth/_backend";

export async function GET(_request, { params }) {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${authApiUrl}/api/work/designs/${id}/file`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 404 ? "The design file was not found." : "The file could not be downloaded." },
        { status: response.status },
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("content-disposition") || "attachment",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "The work service is unavailable." }, { status: 502 });
  }
}

export async function PUT(request, { params }) {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${authApiUrl}/api/work/designs/${id}/file`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const validation = body.errors ? Object.values(body.errors).flat().join(" ") : "";
      return NextResponse.json(
        { error: validation || body.detail || "The design preview could not be updated." },
        { status: response.status },
      );
    }

    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ error: "The work service is unavailable." }, { status: 502 });
  }
}
