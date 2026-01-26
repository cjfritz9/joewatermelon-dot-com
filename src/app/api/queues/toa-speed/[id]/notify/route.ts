import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { canEditQueue } from "@/lib/session";
import { Timestamp } from "@google-cloud/firestore";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userCanEditQueue = await canEditQueue();

    if (!userCanEditQueue) {
      return APIResponse.error("Unauthorized", 401);
    }

    const { id } = await params;

    if (!id) {
      return APIResponse.error("Missing queue entry ID");
    }

    const docRef = firestore.collection("toa-queue").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return APIResponse.error("Queue entry not found", 404);
    }

    await docRef.update({
      notifiedAt: Timestamp.now(),
    });

    return APIResponse.success("Notification sent", { id });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
