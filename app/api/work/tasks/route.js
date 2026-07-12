import { forwardWork } from "../_proxy";
export async function GET(request){return forwardWork(request,"/tasks");}
export async function POST(request){return forwardWork(request,"/tasks","POST");}
