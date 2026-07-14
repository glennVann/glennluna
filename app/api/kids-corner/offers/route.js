import { NextResponse } from "next/server";
import { authApiUrl } from "../../auth/_backend";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function verifyTurnstileToken(token, ipAddress) {
  const formData = new FormData();

  formData.append("secret", getRequiredEnv("TURNSTILE_SECRET_KEY"));
  formData.append("response", token);
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

  return response.json();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { turnstileToken, ...offer } = body;

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Verification is required before sending an offer." },
        { status: 400 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const turnstileResult = await verifyTurnstileToken(
      turnstileToken,
      ipAddress,
    );

    if (!turnstileResult.success) {
      console.warn(
        "Turnstile verification failed:",
        turnstileResult["error-codes"] || [],
      );

      return NextResponse.json(
        {
          error:
            "Verification failed or expired. Please complete the Turnstile check again.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${authApiUrl}/api/kids-corner/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const validation = result.errors
        ? Object.values(result.errors).flat().join(" ")
        : "";
      return NextResponse.json(
        {
          error:
            validation ||
            result.detail ||
            "The offer could not be submitted.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Kids Corner offer failed:", error);
    return NextResponse.json(
      { error: "The offer service is unavailable." },
      { status: 502 },
    );
  }
}
