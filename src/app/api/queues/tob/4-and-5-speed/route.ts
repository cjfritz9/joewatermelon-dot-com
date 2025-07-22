import APIResponse from "@/lib/classes/APIResponse";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(APIResponse.success("End point reached, no functionality currently supported"));
  } catch (err) {
    console.error(err);
    return NextResponse.json(APIResponse.error("Internal Server Error"), {
      status: 500,
    });
  }
}