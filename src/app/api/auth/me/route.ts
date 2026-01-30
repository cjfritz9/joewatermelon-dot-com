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
  const dbRoles = userData?.roles ?? [];

  // Sync session roles with database if they've changed
  if (JSON.stringify(session.roles ?? []) !== JSON.stringify(dbRoles)) {
    session.roles = dbRoles;
    await session.save();
  }

  return APIResponse.success("User check complete", {
    user: {
      id: session.userId,
      email: userData?.email,
      roles: dbRoles,
      isAdmin: dbRoles.includes("admin"),
      isQueueAdmin: dbRoles.includes("queue_admin"),
      canEditQueue:
        dbRoles.includes("admin") || dbRoles.includes("queue_admin"),
      rsn: userData?.rsn ?? null,
      twitchUsername: userData?.twitchUsername ?? null,
      hasTwitchLinked: !!userData?.twitchId,
    },
  });
}
