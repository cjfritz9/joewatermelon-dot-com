import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const { id } = await params;

    if (!id) {
      return APIResponse.error("Missing queue entry ID");
    }

    const docRef = firestore.collection("tob-queue").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return APIResponse.error("Queue entry not found", 404);
    }

    await docRef.delete();

    return APIResponse.success("Queue entry removed", { id });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
