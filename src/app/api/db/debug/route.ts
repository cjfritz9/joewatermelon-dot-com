import { NextResponse } from "next/server";

export const GET = async () => {
  await import("@/lib/db/debug-firestore");
  return NextResponse.json({ message: "Firestore debug complete. Check logs." });
};
