import { NextResponse } from "next/server";
import { getTeamAccessToken, teamEndpoint, teamJsonResponse } from "../_proxy";

async function teamMemberId(params) {
  const { id } = await params;
  return /^\d+$/.test(id) ? id : null;
}

export async function PUT(request, { params }) {
  const token = await getTeamAccessToken();
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const id = await teamMemberId(params);
  if (!id) {
    return NextResponse.json({ error: "Invalid team member." }, { status: 400 });
  }

  try {
    const response = await fetch(teamEndpoint(`/${id}`), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    return teamJsonResponse(response, "Unable to update the team member.");
  } catch {
    return NextResponse.json({ error: "The team service is unavailable." }, { status: 502 });
  }
}

export async function DELETE(_request, { params }) {
  const token = await getTeamAccessToken();
  if (!token) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const id = await teamMemberId(params);
  if (!id) {
    return NextResponse.json({ error: "Invalid team member." }, { status: 400 });
  }

  try {
    const response = await fetch(teamEndpoint(`/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return teamJsonResponse(response, "Unable to delete the team member.");
  } catch {
    return NextResponse.json({ error: "The team service is unavailable." }, { status: 502 });
  }
}
