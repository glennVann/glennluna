import { forwardWork } from "../_proxy";

export async function GET(request) {
  return forwardWork(request, "/quotes");
}

export async function POST(request) {
  return forwardWork(request, "/quotes", "POST");
}
