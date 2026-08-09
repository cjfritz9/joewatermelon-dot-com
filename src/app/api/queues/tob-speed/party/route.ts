import APIResponse from "@/lib/classes/APIResponse";
import { clearParty, createParty, PartyError } from "@/lib/server/party";
import { canEditQueue } from "@/lib/session";

const COLLECTION = "tob-queue";
const SETTINGS_DOC = "tob-speed-settings";

export async function POST(req: Request) {
  try {
    if (!(await canEditQueue())) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { memberIds, world, partyNumber } = body;

    if (
      !Array.isArray(memberIds) ||
      memberIds.some((id) => typeof id !== "string")
    ) {
      return APIResponse.error("Invalid memberIds");
    }

    if (typeof world !== "string" || !world.trim()) {
      return APIResponse.error("Invalid world");
    }

    if (
      typeof partyNumber !== "number" ||
      !Number.isInteger(partyNumber) ||
      partyNumber < 1
    ) {
      return APIResponse.error("Invalid partyNumber");
    }

    await createParty({
      collectionName: COLLECTION,
      settingsDoc: SETTINGS_DOC,
      memberIds,
      world: world.trim(),
      partyNumber,
    });

    return APIResponse.success("Group created");
  } catch (err) {
    if (err instanceof PartyError) {
      return APIResponse.error(err.message);
    }
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function DELETE() {
  try {
    if (!(await canEditQueue())) {
      return APIResponse.error("Unauthorized", 401);
    }

    await clearParty(COLLECTION);

    return APIResponse.success("Group cleared");
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
