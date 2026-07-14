import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../auth/_backend";

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function formatField(value) {
  return value && String(value).trim() ? String(value).trim() : "Not provided";
}

async function verifyTurnstileToken(token, ipAddress) {
  const secretKey = getRequiredEnv("TURNSTILE_SECRET_KEY");
  const formData = new FormData();

  formData.append("secret", secretKey);
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

async function saveAuthenticatedQuote(body) {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return null;

  const response = await fetch(`${authApiUrl}/api/work/quotes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      company: body.company,
      projectType: body.projectType,
      services: Array.isArray(body.services) ? body.services : [],
      timeline: body.timeline,
      budget: body.budget,
      details: body.details,
      infrastructureNotes: body.infrastructureNotes,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    const details = problem.errors
      ? Object.values(problem.errors).flat().join(" ")
      : problem.detail || "Unable to save the quote request to your dashboard.";
    throw new Error(details);
  }

  return response.json();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      projectType,
      timeline,
      budget,
      details,
      infrastructureNotes,
      services,
      turnstileToken,
    } = body;

    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Name, email, and project details are required." },
        { status: 400 },
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Verification is required before sending a quote request." },
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

    await saveAuthenticatedQuote(body);

    const smtpUser = getRequiredEnv("SMTP_USER");
    const smtpPass = getRequiredEnv("SMTP_PASS");
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpSecure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : smtpPort === 465;
    const quoteToEmail = process.env.QUOTE_TO_EMAIL || "info@bindaddy.ca";
    const quoteFromEmail = process.env.QUOTE_FROM_EMAIL || smtpUser;
    const quoteReplySubject =
      process.env.QUOTE_REPLY_SUBJECT || "We received your quote request";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `Project Quote Request - ${name}`;
    const servicesList =
      Array.isArray(services) && services.length
        ? services.join(", ")
        : "Not provided";

    const text = [
      "Project Quote Request",
      "",
      `Name: ${formatField(name)}`,
      `Email: ${formatField(email)}`,
      `Company: ${formatField(company)}`,
      `Project Type: ${formatField(projectType)}`,
      `Services Needed: ${servicesList}`,
      `Timeline: ${formatField(timeline)}`,
      `Budget Range: ${formatField(budget)}`,
      "",
      "Project Details:",
      formatField(details),
      "",
      "Infrastructure / Setup Notes:",
      formatField(infrastructureNotes),
    ].join("\n");

    const html = `
      <h2>Project Quote Request</h2>
      <p><strong>Name:</strong> ${formatField(name)}</p>
      <p><strong>Email:</strong> ${formatField(email)}</p>
      <p><strong>Company:</strong> ${formatField(company)}</p>
      <p><strong>Project Type:</strong> ${formatField(projectType)}</p>
      <p><strong>Services Needed:</strong> ${servicesList}</p>
      <p><strong>Timeline:</strong> ${formatField(timeline)}</p>
      <p><strong>Budget Range:</strong> ${formatField(budget)}</p>
      <p><strong>Project Details:</strong></p>
      <p>${formatField(details).replace(/\n/g, "<br />")}</p>
      <p><strong>Infrastructure / Setup Notes:</strong></p>
      <p>${formatField(infrastructureNotes).replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      from: quoteFromEmail,
      to: quoteToEmail,
      replyTo: email,
      subject,
      text,
      html,
    });

    const confirmationText = [
      `Hi ${name},`,
      "",
      "Thank you for reaching out and requesting a project quotation.",
      "Your inquiry has been received successfully.",
      "I will review the details and follow up with you as soon as possible regarding the next steps.",
      "",
      "Request summary:",
      `Project Type: ${formatField(projectType)}`,
      `Services Needed: ${servicesList}`,
      `Timeline: ${formatField(timeline)}`,
      `Budget Range: ${formatField(budget)}`,
      "",
      "If you would like to add more information before I respond, you can reply directly to this email.",
      "",
      "Best regards,",
      "Glenn Luna",
      "Software Developer",
    ].join("\n");

    const confirmationHtml = `
      <p>Hi ${formatField(name)},</p>
      <p>
        Thank you for reaching out and requesting a project quotation. Your
        inquiry has been received successfully.
      </p>
      <p>
        I will review the details and follow up with you as soon as possible
        regarding the next steps.
      </p>
      <p><strong>Request summary:</strong></p>
      <p><strong>Project Type:</strong> ${formatField(projectType)}</p>
      <p><strong>Services Needed:</strong> ${servicesList}</p>
      <p><strong>Timeline:</strong> ${formatField(timeline)}</p>
      <p><strong>Budget Range:</strong> ${formatField(budget)}</p>
      <p>
        If you would like to add more information before I respond, you can
        reply directly to this email.
      </p>
      <p>Best regards,<br />Glenn Luna<br />Software Developer</p>
    `;

    await transporter.sendMail({
      from: quoteFromEmail,
      to: email,
      replyTo: quoteToEmail,
      subject: quoteReplySubject,
      text: confirmationText,
      html: confirmationHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Quote email send failed:", error);

    return NextResponse.json(
      {
        error:
          "Unable to send the quote request right now. Check the server configuration and try again.",
      },
      { status: 500 },
    );
  }
}
