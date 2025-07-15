import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import firestore from "@/lib/db/firestore";

export async function GET() {
  const session = await getSession();

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSnap = await firestore.collection("users").doc(session.userId).get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userData = userSnap.data();

  return NextResponse.json({
    user: {
      id: session.userId,
      email: userData?.email,
      name: userData?.name ?? null,
    },
  });
}
