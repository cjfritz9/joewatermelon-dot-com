import APIResponse from "@/lib/classes/APIResponse";
import { PartyError, returnPartyMembers } from "@/lib/server/party";
import { canEditQueue } from "@/lib/session";

const COLLECTION = "toa-queue";

export async function POST(req: Request) {
  try {
    if (!(await canEditQueue())) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { ids } = body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => typeof id !== "string")
    ) {
      return APIResponse.error("Invalid ids");
    }

    await returnPartyMembers(COLLECTION, ids);

    return APIResponse.success("Members returned to queue");
  } catch (err) {
    if (err instanceof PartyError) {
      return APIResponse.error(err.message);
    }
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
