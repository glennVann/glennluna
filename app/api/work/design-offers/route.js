import { forwardWork } from "../_proxy";

export async function GET(request) {
  return forwardWork(request, "/design-offers");
}
