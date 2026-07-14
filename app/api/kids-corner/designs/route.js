import { NextResponse } from "next/server";
import { authApiUrl } from "../../auth/_backend";

export async function GET() {
  try {
    const response = await fetch(`${authApiUrl}/api/kids-corner/designs`, {
      cache: "no-store",
    });
    const body = await response.json().catch(() => []);

    if (!response.ok) {
      return NextResponse.json(
        { error: "The Kids Corner gallery could not be loaded." },
        { status: response.status },
      );
    }

    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "The Kids Corner service is unavailable." },
      { status: 502 },
    );
  }
}
