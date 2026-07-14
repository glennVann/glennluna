import { forwardWork } from "../../_proxy";

export async function PUT(request, { params }) {
  const { id } = await params;
  return forwardWork(request, `/designs/${id}`, "PUT");
}
