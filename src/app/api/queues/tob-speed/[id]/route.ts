import { DBTobQueueEntrant } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import { validatePublicFields } from "@/lib/content-filter";
import firestore from "@/lib/db/firestore";
import { MAX_NOTES_LENGTH } from "@/lib/db/validation";
import { canEditQueue, getSession } from "@/lib/session";

const EDITABLE_FIELDS = [
  "twitchUsername",
  "rsn",
  "kc",
  "ready",
  "scythe",
  "needs4Man",
  "needs5Man",
  "notes",
  "notificationsEnabled",
];

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return APIResponse.error("Missing queue entry ID");
    }

    const docRef = firestore.collection("tob-queue").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return APIResponse.error("Queue entry not found", 404);
    }

    const existingData = doc.data() as DBTobQueueEntrant;
    const userCanEditQueue = await canEditQueue();

    if (!userCanEditQueue) {
      const session = await getSession();
      const body = await req.json().catch(() => ({}));
      const { editToken } = body;

      const isOwner =
        (session.userId && existingData.userId === session.userId) ||
        (editToken && existingData.editToken === editToken);

      if (!isOwner) {
        return APIResponse.error("Unauthorized", 401);
      }
    }

    await docRef.delete();

    return APIResponse.success("Queue entry removed", { id });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return APIResponse.error("Missing queue entry ID");
    }

    const docRef = firestore.collection("tob-queue").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return APIResponse.error("Queue entry not found", 404);
    }

    const existingData = doc.data() as DBTobQueueEntrant;

    // Check authorization: user must own entry via userId or editToken
    const session = await getSession();
    const body = await req.json();
    const { editToken, data } = body;

    const isOwner =
      (session.userId && existingData.userId === session.userId) ||
      (editToken && existingData.editToken === editToken);

    if (!isOwner) {
      return APIResponse.error("Unauthorized", 401);
    }

    if (!data || typeof data !== "object") {
      return APIResponse.error("Invalid request body");
    }

    // Filter to only allowed fields
    const updates: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in data) {
        updates[field] = data[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return APIResponse.error("No valid fields to update");
    }

    // Validate notes length
    if (typeof updates.notes === "string" && updates.notes.length > MAX_NOTES_LENGTH) {
      return APIResponse.error("Notes too long");
    }

    // Validate public fields for hate speech
    const contentError = await validatePublicFields({
      twitchUsername: updates.twitchUsername as string | undefined,
      rsn: updates.rsn as string | undefined,
    });

    if (contentError) {
      return APIResponse.error(contentError);
    }

    // If RSN is being changed, check for duplicates
    if (updates.rsn && updates.rsn !== existingData.rsn) {
      const duplicateCheck = await firestore
        .collection("tob-queue")
        .where("rsn", "==", updates.rsn)
        .limit(1)
        .get();

      if (!duplicateCheck.empty) {
        return APIResponse.error("This RSN is already in the queue");
      }
    }

    await docRef.update(updates);

    return APIResponse.success("Queue entry updated", { id });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
