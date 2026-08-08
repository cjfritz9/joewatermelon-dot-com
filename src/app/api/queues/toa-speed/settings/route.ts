import APIResponse from "@/lib/classes/APIResponse";
import {
  getEventSettings,
  SignupOverride,
  updateEventSettings,
} from "@/lib/server/event-settings";
import { isWeeklySchedule, WeeklySchedule } from "@/lib/time";
import { isAdmin } from "@/lib/session";

const SETTINGS_DOC = "toa-8man-speed-settings";

export async function GET() {
  try {
    const settings = await getEventSettings(SETTINGS_DOC);

    return APIResponse.success("Settings found", {
      status: settings.status,
      phase: settings.phase,
      override: settings.override,
      nextRunTime: settings.nextRunTime?.toISOString() || null,
      weeklySchedule: settings.weeklySchedule,
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
    const { override, nextRunTime, weeklySchedule } = body;

    let signupOverride: SignupOverride | null;
    if (override === "open" || override === "closed") {
      signupOverride = override;
    } else if (
      override === "auto" ||
      override === null ||
      override === undefined
    ) {
      signupOverride = null;
    } else {
      return APIResponse.error("Invalid override");
    }

    let schedule: WeeklySchedule | null | undefined = undefined;
    if (weeklySchedule !== undefined) {
      if (weeklySchedule === null) {
        schedule = null;
      } else if (isWeeklySchedule(weeklySchedule)) {
        schedule = weeklySchedule;
      } else {
        return APIResponse.error("Invalid weeklySchedule");
      }
    }

    await updateEventSettings(
      SETTINGS_DOC,
      signupOverride,
      nextRunTime ? new Date(nextRunTime) : null,
      schedule,
    );

    return APIResponse.success("Settings updated");
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
