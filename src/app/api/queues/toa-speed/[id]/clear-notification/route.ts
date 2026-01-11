import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { FieldValue } from "@google-cloud/firestore";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
      notifiedAt: FieldValue.delete(),
    });

    return APIResponse.success("Notification cleared", { id });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
