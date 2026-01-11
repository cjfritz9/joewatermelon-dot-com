import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";

export async function PUT(req: Request) {
  try {
    const session = await getSession();

    if (!session.userId) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { rsn, twitchUsername } = body;

    const userRef = firestore.collection("users").doc(session.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return APIResponse.error("User not found", 404);
    }

    const userData = userDoc.data() as DBUser;

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // Always allow RSN updates
    if (rsn !== undefined) {
      updates.rsn = rsn || null;
    }

    // Only allow twitchUsername updates if not OAuth-linked
    if (twitchUsername !== undefined && !userData.twitchId) {
      updates.twitchUsername = twitchUsername || null;
    }

    await userRef.update(updates);

    return APIResponse.success("Profile updated successfully");
  } catch (err) {
    console.error("Profile update error:", err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
