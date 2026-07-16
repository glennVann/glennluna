import { authApiUrl } from "../../../../auth/_backend";

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${authApiUrl}/api/kids-corner/designs/${id}/image`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return new Response(null, { status: response.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "image/png");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "no-store");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
