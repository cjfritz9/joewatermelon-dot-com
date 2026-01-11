import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { id, direction } = body;

    if (!id || !direction) {
      return APIResponse.error("Missing id or direction");
    }

    if (direction !== "up" && direction !== "down") {
      return APIResponse.error("Invalid direction. Use 'up' or 'down'");
    }

    const queueSnapshot = await firestore.collection("tob-queue").get();

    if (queueSnapshot.empty) {
      return APIResponse.error("Queue is empty", 404);
    }

    const docs = queueSnapshot.docs.map((doc) => ({
      id: doc.id,
      order: doc.data().order ?? Number.MAX_SAFE_INTEGER,
      createdAt: doc.data().createdAt,
    }));

    docs.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.createdAt?.toMillis() - b.createdAt?.toMillis();
    });

    const currentIndex = docs.findIndex((doc) => doc.id === id);

    if (currentIndex === -1) {
      return APIResponse.error("Player not found in queue", 404);
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= docs.length) {
      return APIResponse.error("Cannot move player further in that direction");
    }

    const batch = firestore.batch();
    const currentDoc = firestore.collection("tob-queue").doc(docs[currentIndex].id);
    const targetDoc = firestore.collection("tob-queue").doc(docs[targetIndex].id);

    batch.update(currentDoc, { order: targetIndex });
    batch.update(targetDoc, { order: currentIndex });

    await batch.commit();

    return APIResponse.success("Queue order updated");
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
