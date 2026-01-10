import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";

export const GET = async () => {
  const doc = firestore.doc("test/firestore-test");

  await doc.set({
    timestamp: new Date().toISOString(),
  });

  await doc.delete();

  return APIResponse.success("Firestore operations completed");
};
