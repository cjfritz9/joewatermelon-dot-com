import APIResponse from "@/lib/classes/APIResponse";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  session.destroy();

  return NextResponse.json(APIResponse.success("Logged out"));
}
