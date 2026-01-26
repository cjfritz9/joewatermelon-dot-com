import { DBToaQueueEntrant } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getToaQueueEntryIsValid } from "@/lib/db/validation";
import { getSession } from "@/lib/session";
import { Timestamp } from "@google-cloud/firestore";
import crypto from "crypto";

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
        createdAt: data.createdAt?.toDate().toISOString() || null,
        notifiedAt: data.notifiedAt?.toDate().toISOString() || null,
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

    const session = await getSession();
    const userId = session.userId;
    const editToken = userId ? null : crypto.randomBytes(32).toString("hex");

    const docRef = await firestore.collection("toa-queue").add({
      createdAt: Timestamp.now(),
      ...data,
      ...(userId && { userId }),
      ...(editToken && { editToken }),
    });

    return APIResponse.success("Document added to queue", { id: docRef.id, editToken }, 201);
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
