import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getToaQueueEntryIsValid } from "@/lib/db/validation";
import { Timestamp } from "@google-cloud/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const queueSnapshot = await firestore.collection("toa-queue").get();

    if (queueSnapshot.empty) {
      return NextResponse.json(
        APIResponse.success("No documents found within queue, defaulting", []),
      );
    }

    const docs = queueSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(APIResponse.success("Queue found", docs));
  } catch (err) {
    console.error(err);
    return NextResponse.json(APIResponse.error("Internal Server Error"), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(APIResponse.error("Invalid request body"), {
        status: 400,
      });
    }

    const { data } = body;

    const isValid = getToaQueueEntryIsValid(data);

    if (!isValid) {
      return NextResponse.json(
        APIResponse.error("Missing required fields"),
        { status: 400 },
      );
    }

    const docRef = await firestore.collection("toa-queue").add({
      createdAt: Timestamp.now(),
      ...data,
    });

    return NextResponse.json(
      APIResponse.success("Document added to queue", { id: docRef.id }),
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(APIResponse.error("Internal Server Error"), {
      status: 500,
    });
  }
}
