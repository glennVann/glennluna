import { cookies } from "next/headers";
import { accessCookie, authApiUrl } from "../_backend";

export async function GET() {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return new Response(null, { status: 401 });

  try {
    const response = await fetch(`${authApiUrl}/api/auth/avatar`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return new Response(null, { status: response.status });

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
