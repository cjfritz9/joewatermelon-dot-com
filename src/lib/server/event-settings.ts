import { Timestamp } from "@google-cloud/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";

export type EventStatus = "active" | "inactive";

export interface EventSettings {
  status: EventStatus;
  nextRunTime: Date | null;
}

const AUTO_DEACTIVATE_AFTER_MS = 12 * 60 * 60 * 1000;

const DEFAULT_SETTINGS: EventSettings = {
  status: "inactive",
  nextRunTime: null,
};

const isStale = (activatedAt: Date | null): boolean =>
  activatedAt !== null &&
  Date.now() - activatedAt.getTime() >= AUTO_DEACTIVATE_AFTER_MS;

export const getEventSettings = async (
  docId: string,
): Promise<EventSettings> => {
  if (!isFirestoreAvailable) return DEFAULT_SETTINGS;

  try {
    const ref = firestore.collection("settings").doc(docId);
    const doc = await ref.get();

    if (!doc.exists) return DEFAULT_SETTINGS;

    const data = doc.data();
    const status: EventStatus =
      data?.status === "active" ? "active" : "inactive";
    const nextRunTime: Date | null = data?.nextRunTime?.toDate() ?? null;
    const activatedAt: Date | null = data?.activatedAt?.toDate() ?? null;

    if (status === "active" && isStale(activatedAt)) {
      await ref.set(
        {
          status: "inactive",
          activatedAt: null,
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
      return { status: "inactive", nextRunTime };
    }

    return { status, nextRunTime };
  } catch (err) {
    console.error(err);
    return DEFAULT_SETTINGS;
  }
};

export const updateEventSettings = async (
  docId: string,
  status: EventStatus,
  nextRunTime: Date | null,
): Promise<void> => {
  const ref = firestore.collection("settings").doc(docId);

  let activatedAt: Timestamp | null = null;
  if (status === "active") {
    const existing = await ref.get();
    const existingData = existing.data();
    const existingActivatedAt = existingData?.activatedAt as
      | Timestamp
      | undefined;
    activatedAt =
      existingData?.status === "active" && existingActivatedAt
        ? existingActivatedAt
        : Timestamp.now();
  }

  await ref.set({
    status,
    nextRunTime: nextRunTime ? Timestamp.fromDate(nextRunTime) : null,
    activatedAt,
    updatedAt: Timestamp.now(),
  });
};
