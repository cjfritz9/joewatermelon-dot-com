import { DBToaQueueEntrant } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getToaQueueEntryIsValid } from "@/lib/db/validation";
import { Timestamp } from "@google-cloud/firestore";

export async function GET() {
  try {
    const queueSnapshot = await firestore.collection("toa-queue").get();

    if (queueSnapshot.empty) {
      return APIResponse.success("No documents found within queue, defaulting", []);
    }

    const docs = queueSnapshot.docs.map((doc) => {
      const data = doc.data() as DBToaQueueEntrant;

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || null,
      };
    });

    return APIResponse.success("Queue found", docs);
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return APIResponse.error("Invalid request body");
    }

    const { data } = body;

    const isValid = getToaQueueEntryIsValid(data);

    if (!isValid) {
      return APIResponse.error("Missing required fields");
    }

    const existingEntry = await firestore
      .collection("toa-queue")
      .where("rsn", "==", data.rsn)
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      return APIResponse.error("This RSN is already in the queue");
    }

    const docRef = await firestore.collection("toa-queue").add({
      createdAt: Timestamp.now(),
      ...data,
    });

    return APIResponse.success("Document added to queue", { id: docRef.id }, 201);
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
