import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session.userId) {
    return NextResponse.json(APIResponse.error("Unauthorized"), {
      status: 401,
    });
  }

  const userSnap = await firestore
    .collection("users")
    .doc(session.userId)
    .get();

  if (!userSnap.exists) {
    return NextResponse.json(APIResponse.error("User not found"), {
      status: 404,
    });
  }

  const userData = userSnap.data() as DBUser;

  return NextResponse.json(
    APIResponse.success("User check complete", {
      user: {
        id: session.userId,
        email: userData?.email,
      },
    }),
  );
}
