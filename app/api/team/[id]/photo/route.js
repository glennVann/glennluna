import { NextResponse } from "next/server";
import { teamEndpoint } from "../../_proxy";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid team member." }, { status: 400 });
  }

  try {
    const response = await fetch(teamEndpoint(`/${id}/photo`), { cache: "no-store" });
    if (!response.ok) return new Response(null, { status: response.status });

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
