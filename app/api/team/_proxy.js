import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../auth/_backend";

export async function getTeamAccessToken() {
  return (await cookies()).get(accessCookie)?.value;
}

export function teamEndpoint(path = "") {
  return `${authApiUrl}/api/team${path}`;
}

export async function teamJsonResponse(response, fallbackError) {
  const body = await response.text();
  let result = {};

  if (body) {
    try {
      result = JSON.parse(body);
    } catch {
      result = {};
    }
  }

  if (!response.ok) {
    const validationError = result.errors
      ? Object.values(result.errors).flat().filter(Boolean).join(" ")
      : "";
    const error = validationError || result.error || result.detail || fallbackError;
    return NextResponse.json({ error }, { status: response.status });
  }

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  return NextResponse.json(result, { status: response.status });
}
