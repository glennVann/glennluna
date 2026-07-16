import { NextResponse } from "next/server";
import { authApiUrl } from "../_backend";
import { verifyTurnstileRequest } from "../_turnstile";

export async function POST(request) {
  try {
    const { email, password, turnstileToken } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const turnstileError = await verifyTurnstileRequest(request, turnstileToken);
    if (turnstileError) return turnstileError;

    const response = await fetch(`${authApiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (response.ok) return NextResponse.json({ ok: true });

    const problem = await response.json().catch(() => ({}));
    const details = problem.errors
      ? Object.values(problem.errors).flat().join(" ")
      : "Unable to create the account. The email may already be registered.";
    return NextResponse.json({ error: details }, { status: response.status });
  } catch {
    return NextResponse.json({ error: "The registration service is unavailable." }, { status: 502 });
  }
}
