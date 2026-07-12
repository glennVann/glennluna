import {cookies} from "next/headers";
import {accessCookie,authApiUrl} from "../../../../auth/_backend";
export async function GET(_request,{params}){
 const token=(await cookies()).get(accessCookie)?.value;if(!token)return Response.json({error:"You must be signed in."},{status:401});
 const{id}=await params;try{const response=await fetch(`${authApiUrl}/api/work/tasks/${id}/submission-file`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!response.ok)return Response.json({error:"The file is unavailable."},{status:response.status});
  return new Response(response.body,{status:200,headers:{"Content-Type":response.headers.get("content-type")||"application/octet-stream","Content-Disposition":response.headers.get("content-disposition")||"attachment","X-Content-Type-Options":"nosniff","Cache-Control":"private, no-store"}});
 }catch{return Response.json({error:"The file service is unavailable."},{status:502});}
}
