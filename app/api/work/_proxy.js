import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookie, authApiUrl } from "../auth/_backend";
export async function forwardWork(request, path, method = "GET") {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  try { const response = await fetch(`${authApiUrl}/api/work${path}`, { method, headers:{Authorization:`Bearer ${token}`,...(method!=="GET"?{"Content-Type":"application/json"}:{})}, body:method!=="GET"?await request.text():undefined, cache:"no-store" });
    if(response.status===204)return new Response(null,{status:204}); const text=await response.text(); let body={}; try{body=text?JSON.parse(text):{}}catch{};
    if(!response.ok){const validation=body.errors?Object.values(body.errors).flat().join(" "):"";return NextResponse.json({error:validation||body.detail||"The request could not be completed."},{status:response.status});}
    return NextResponse.json(body,{status:response.status});
  } catch { return NextResponse.json({error:"The work service is unavailable."},{status:502}); }
}
