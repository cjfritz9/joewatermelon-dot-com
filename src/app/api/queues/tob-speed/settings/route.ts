import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";
import { Timestamp } from "@google-cloud/firestore";

const SETTINGS_DOC = "tob-speed-settings";

export async function GET() {
  try {
    const doc = await firestore.collection("settings").doc(SETTINGS_DOC).get();

    if (!doc.exists) {
      return APIResponse.success("No settings found", {
        status: "inactive",
        nextRunTime: null,
      });
    }

    const data = doc.data();
    return APIResponse.success("Settings found", {
      status: data?.status || "inactive",
      nextRunTime: data?.nextRunTime?.toDate()?.toISOString() || null,
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

    await firestore
      .collection("settings")
      .doc(SETTINGS_DOC)
      .set({
        status,
        nextRunTime: nextRunTime ? Timestamp.fromDate(new Date(nextRunTime)) : null,
        updatedAt: Timestamp.now(),
      });

    return APIResponse.success("Settings updated");
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
