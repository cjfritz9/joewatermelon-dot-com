import firestore from "@/lib/db/firestore";
import { NextResponse } from "next/server";

export const GET = async () => {
  const doc = firestore.doc("test/firestore-test");

  await doc.set({
    timestamp: new Date().toISOString(),
  });

  const docTest = await doc.get();
  const data = docTest.data();

  await doc.delete();

  return NextResponse.json({ message: "Firestore operations completed", data });
};
