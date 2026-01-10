import APIResponse from "@/lib/classes/APIResponse";

export const GET = async () => {
  await import("@/lib/db/debug-firestore");
  return APIResponse.success("Firestore debug complete. Check logs.");
};
