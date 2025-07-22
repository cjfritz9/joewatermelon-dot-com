import APIResponse from "@/lib/classes/APIResponse";
import { NextResponse } from "next/server";

export const GET = async () => {
  await import("@/lib/db/debug-firestore");
  return NextResponse.json(
    APIResponse.success("Firestore debug complete. Check logs."),
  );
};
