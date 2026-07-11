import APIResponse from "@/lib/classes/APIResponse";
import { getEventSettings, updateEventSettings } from "@/lib/server/event-settings";
import { isAdmin } from "@/lib/session";

const SETTINGS_DOC = "tob-speed-settings";

export async function GET() {
  try {
    const settings = await getEventSettings(SETTINGS_DOC);

    return APIResponse.success("Settings found", {
      status: settings.status,
      nextRunTime: settings.nextRunTime?.toISOString() || null,
    });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { status, nextRunTime } = body;

    if (!status || !["active", "inactive"].includes(status)) {
      return APIResponse.error("Invalid status");
    }

    await updateEventSettings(
      SETTINGS_DOC,
      status,
      nextRunTime ? new Date(nextRunTime) : null,
    );

    return APIResponse.success("Settings updated");
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
