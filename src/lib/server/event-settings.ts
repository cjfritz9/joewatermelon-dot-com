import { Timestamp } from "@google-cloud/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";
import {
  isWeeklySchedule,
  nextOccurrenceAfter,
  WeeklySchedule,
} from "../time";

export type EventStatus = "active" | "inactive";

export interface EventSettings {
  status: EventStatus;
  nextRunTime: Date | null;
  weeklySchedule: WeeklySchedule | null;
}

const AUTO_DEACTIVATE_AFTER_MS = 12 * 60 * 60 * 1000;
const HALF_WEEK_MS = 3.5 * 24 * 60 * 60 * 1000;

const DEFAULT_SETTINGS: EventSettings = {
  status: "inactive",
  nextRunTime: null,
  weeklySchedule: null,
};

const isStale = (activatedAt: Date | null): boolean =>
  activatedAt !== null &&
  Date.now() - activatedAt.getTime() >= AUTO_DEACTIVATE_AFTER_MS;

const isInRunWindow = (nextRunTime: Date): boolean => {
  const start = nextRunTime.getTime();
  const now = Date.now();
  return now >= start && now < start + AUTO_DEACTIVATE_AFTER_MS;
};

const runWindowEnded = (nextRunTime: Date): boolean =>
  Date.now() >= nextRunTime.getTime() + AUTO_DEACTIVATE_AFTER_MS;

const rollForward = (
  schedule: WeeklySchedule,
  previousRunTime: Date | null,
): Date => {
  const base = previousRunTime
    ? Math.max(previousRunTime.getTime() + HALF_WEEK_MS, Date.now())
    : Date.now();
  return nextOccurrenceAfter(schedule, new Date(base));
};

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
    const weeklySchedule: WeeklySchedule | null = isWeeklySchedule(
      data?.weeklySchedule,
    )
      ? data.weeklySchedule
      : null;

    if (status === "active" && isStale(activatedAt)) {
      const rolled = weeklySchedule
        ? rollForward(weeklySchedule, nextRunTime)
        : nextRunTime;
      await ref.set(
        {
          status: "inactive",
          activatedAt: null,
          nextRunTime: rolled ? Timestamp.fromDate(rolled) : null,
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
      return { status: "inactive", nextRunTime: rolled, weeklySchedule };
    }

    if (status === "inactive" && nextRunTime && isInRunWindow(nextRunTime)) {
      await ref.set(
        {
          status: "active",
          activatedAt: Timestamp.fromDate(nextRunTime),
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
      return { status: "active", nextRunTime, weeklySchedule };
    }

    if (
      status === "inactive" &&
      weeklySchedule &&
      (!nextRunTime || runWindowEnded(nextRunTime))
    ) {
      const rolled = rollForward(weeklySchedule, nextRunTime);
      await ref.set(
        {
          nextRunTime: Timestamp.fromDate(rolled),
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
      return { status: "inactive", nextRunTime: rolled, weeklySchedule };
    }

    return { status, nextRunTime, weeklySchedule };
  } catch (err) {
    console.error(err);
    return DEFAULT_SETTINGS;
  }
};

export const updateEventSettings = async (
  docId: string,
  status: EventStatus,
  nextRunTime: Date | null,
  weeklySchedule?: WeeklySchedule | null,
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

  const payload: Record<string, unknown> = {
    status,
    nextRunTime: nextRunTime ? Timestamp.fromDate(nextRunTime) : null,
    activatedAt,
    updatedAt: Timestamp.now(),
  };

  if (weeklySchedule !== undefined) {
    payload.weeklySchedule = weeklySchedule;
  }

  await ref.set(payload, { merge: true });
};
