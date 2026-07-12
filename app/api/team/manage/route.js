import { NextResponse } from "next/server";
import { getTeamAccessToken, teamEndpoint, teamJsonResponse } from "../_proxy";

export async function GET() {
  const token = await getTeamAccessToken();
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const response = await fetch(teamEndpoint("/manage"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return teamJsonResponse(response, "You are not allowed to manage the team.");
  } catch {
    return NextResponse.json({ error: "The team service is unavailable." }, { status: 502 });
  }
}
