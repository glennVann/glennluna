import { NextResponse } from "next/server";
import { accessCookie, refreshCookie } from "../_backend";

export function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(accessCookie);
  response.cookies.delete(refreshCookie);
  return response;
}
