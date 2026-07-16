import { NextResponse } from "next/server";

export async function verifyTurnstileRequest(request, turnstileToken) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return NextResponse.json(
      { error: "Verification is not configured yet." },
      { status: 500 },
    );
  }

  if (!turnstileToken) {
    return NextResponse.json(
      { error: "Verification is required before continuing." },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const formData = new FormData();

  formData.append("secret", secret);
  formData.append("response", turnstileToken);
  formData.append("idempotency_key", crypto.randomUUID());

  if (ipAddress) {
    formData.append("remoteip", ipAddress);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Turnstile siteverify request failed.");
  }

  const result = await response.json();
  if (result.success) return null;

  console.warn("Turnstile verification failed:", result["error-codes"] || []);
  return NextResponse.json(
    {
      error:
        "Verification failed or expired. Please complete the Turnstile check again.",
    },
    { status: 400 },
  );
}
