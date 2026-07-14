import { forwardWork } from "../_proxy";

export async function GET(request) {
  return forwardWork(request, "/designs");
}

export async function POST(request) {
  return forwardWork(request, "/designs", "POST");
}
