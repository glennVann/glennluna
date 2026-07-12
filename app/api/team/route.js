import { NextResponse } from "next/server";
import { getTeamAccessToken, teamEndpoint, teamJsonResponse } from "./_proxy";

export async function GET() {
  try {
    const response = await fetch(teamEndpoint(), { cache: "no-store" });
    return teamJsonResponse(response, "Unable to load the team.");
  } catch {
    return NextResponse.json({ error: "The team service is unavailable." }, { status: 502 });
  }
}

export async function POST(request) {
  const token = await getTeamAccessToken();
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const response = await fetch(teamEndpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    return teamJsonResponse(response, "Unable to add the team member.");
  } catch {
    return NextResponse.json({ error: "The team service is unavailable." }, { status: 502 });
  }
}
