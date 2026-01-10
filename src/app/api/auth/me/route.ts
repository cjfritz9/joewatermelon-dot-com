import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session.userId) {
    return APIResponse.error("Unauthorized", 401);
  }

  const userSnap = await firestore
    .collection("users")
    .doc(session.userId)
    .get();

  if (!userSnap.exists) {
    return APIResponse.error("User not found", 404);
  }

  const userData = userSnap.data() as DBUser;

  return APIResponse.success("User check complete", {
    user: {
      id: session.userId,
      email: userData?.email,
      isAdmin: userData?.roles?.includes("admin") ?? false,
    },
  });
}
