import { NextResponse } from "next/server";
import { authApiUrl } from "../_backend";
import { verifyTurnstileRequest } from "../_turnstile";

export async function POST(request) {
  try {
    const { email, resetCode, newPassword, turnstileToken } = await request.json();
    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset code, and new password are required." },
        { status: 400 },
      );
    }

    const turnstileError = await verifyTurnstileRequest(request, turnstileToken);
    if (turnstileError) return turnstileError;

    const response = await fetch(`${authApiUrl}/api/auth/resetPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resetCode, newPassword }),
      cache: "no-store",
    });

    if (response.ok) {
      return NextResponse.json({ ok: true });
    }

    const problem = await response.json().catch(() => ({}));
    const details = problem.errors
      ? Object.values(problem.errors).flat().join(" ")
      : "The reset code is invalid, expired, or the new password is too weak.";
    return NextResponse.json({ error: details }, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "The password reset service is unavailable." },
      { status: 502 },
    );
  }
}
