import { NextResponse } from "next/server";
import { authApiUrl } from "../_backend";
import { verifyTurnstileRequest } from "../_turnstile";

export async function POST(request) {
  try {
    const { email, turnstileToken } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const turnstileError = await verifyTurnstileRequest(request, turnstileToken);
    if (turnstileError) return turnstileError;

    const response = await fetch(`${authApiUrl}/api/auth/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    if (response.ok) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Unable to send the reset code right now." },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      { error: "The password reset service is unavailable." },
      { status: 502 },
    );
  }
}
