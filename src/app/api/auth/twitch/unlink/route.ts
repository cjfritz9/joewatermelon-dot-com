import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";
import { FieldValue } from "@google-cloud/firestore";

export const POST = async () => {
  try {
    const session = await getSession();

    if (!session.userId) {
      return APIResponse.error("Unauthorized", 401);
    }

    const userRef = firestore.collection("users").doc(session.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return APIResponse.error("User not found", 404);
    }

    const userData = userDoc.data() as DBUser;

    // Check if user has a password - prevent orphaning OAuth-only accounts
    if (!userData.passwordHash) {
      return APIResponse.error(
        "Cannot unlink Twitch. Please set a password first.",
        400
      );
    }

    // Check if Twitch is actually linked
    if (!userData.twitchId) {
      return APIResponse.error("No Twitch account is linked", 400);
    }

    // Remove Twitch fields
    await userRef.update({
      twitchId: FieldValue.delete(),
      twitchUsername: FieldValue.delete(),
      twitchLinkedAt: FieldValue.delete(),
      updatedAt: new Date(),
    });

    // Update session
    delete session.twitchUsername;
    await session.save();

    return APIResponse.success("Twitch account unlinked successfully");
  } catch (err) {
    console.error("Twitch unlink error:", err);
    return APIResponse.error("Internal Server Error", 500);
  }
};
