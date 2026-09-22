import APIResponse from "@/lib/classes/APIResponse";
import { addPartyMembers, PartyError } from "@/lib/server/party";
import { canEditQueue } from "@/lib/session";

const COLLECTION = "toa-queue";

export async function POST(req: Request) {
  try {
    if (!(await canEditQueue())) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { memberIds } = body;

    if (
      !Array.isArray(memberIds) ||
      memberIds.length === 0 ||
      memberIds.some((id) => typeof id !== "string")
    ) {
      return APIResponse.error("Invalid memberIds");
    }

    await addPartyMembers(COLLECTION, memberIds);

    return APIResponse.success("Members added to group");
  } catch (err) {
    if (err instanceof PartyError) {
      return APIResponse.error(err.message);
    }
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
