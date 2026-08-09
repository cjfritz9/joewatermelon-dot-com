import { Timestamp } from "@google-cloud/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";
import {
  isWeeklySchedule,
  nextOccurrenceAfter,
  RUN_WINDOW_MS,
  SIGNUP_LEAD_MS,
  WeeklySchedule,
} from "../time";

export type EventStatus = "active" | "inactive";
export type EventPhase = "closed" | "open" | "in_progress";
export type SignupOverride = "open" | "closed";

export interface EventSettings {
  status: EventStatus;
  phase: EventPhase;
  override: SignupOverride | null;
  nextRunTime: Date | null;
  weeklySchedule: WeeklySchedule | null;
  nextPartyNumber: number;
}

const HALF_WEEK_MS = 3.5 * 24 * 60 * 60 * 1000;

const DEFAULT_SETTINGS: EventSettings = {
  status: "inactive",
  phase: "closed",
  override: null,
  nextRunTime: null,
  weeklySchedule: null,
  nextPartyNumber: 1,
};

const runWindowEnded = (nextRunTime: Date): boolean =>
  Date.now() >= nextRunTime.getTime() + RUN_WINDOW_MS;

const rollForward = (
  schedule: WeeklySchedule,
  previousRunTime: Date | null,
): Date => {
  const base = previousRunTime
    ? Math.max(previousRunTime.getTime() + HALF_WEEK_MS, Date.now())
    : Date.now();
  return nextOccurrenceAfter(schedule, new Date(base));
};

const parseOverride = (value: unknown): SignupOverride | null =>
  value === "open" || value === "closed" ? value : null;

const derivePhase = (
  nextRunTime: Date | null,
  override: SignupOverride | null,
): { status: EventStatus; phase: EventPhase } => {
  const now = Date.now();
  const start = nextRunTime?.getTime() ?? null;

  const timeOpen =
    start !== null &&
    now >= start - SIGNUP_LEAD_MS &&
    now < start + RUN_WINDOW_MS;
  const open =
    override === "open" ? true : override === "closed" ? false : timeOpen;
  const inProgress =
    open && start !== null && now >= start && now < start + RUN_WINDOW_MS;

  return {
    status: open ? "active" : "inactive",
    phase: !open ? "closed" : inProgress ? "in_progress" : "open",
  };
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
    let nextRunTime: Date | null = data?.nextRunTime?.toDate() ?? null;
    let override = parseOverride(data?.override);
    const weeklySchedule: WeeklySchedule | null = isWeeklySchedule(
      data?.weeklySchedule,
    )
      ? data.weeklySchedule
      : null;

    if (override && nextRunTime && runWindowEnded(nextRunTime)) {
      override = null;
      await ref.set(
        { override: null, updatedAt: Timestamp.now() },
        { merge: true },
      );
    }

    if (weeklySchedule && (!nextRunTime || runWindowEnded(nextRunTime))) {
      nextRunTime = rollForward(weeklySchedule, nextRunTime);
      await ref.set(
        {
          nextRunTime: Timestamp.fromDate(nextRunTime),
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
    }

    const runKey = nextRunTime ? nextRunTime.getTime() : null;
    const partyCounter =
      typeof data?.partyCounter === "number" ? data.partyCounter : 0;
    const partyCounterRun =
      typeof data?.partyCounterRun === "number" ? data.partyCounterRun : null;
    const nextPartyNumber = partyCounterRun === runKey ? partyCounter + 1 : 1;

    const { status, phase } = derivePhase(nextRunTime, override);
    return {
      status,
      phase,
      override,
      nextRunTime,
      weeklySchedule,
      nextPartyNumber,
    };
  } catch (err) {
    console.error(err);
    return DEFAULT_SETTINGS;
  }
};

export const updateEventSettings = async (
  docId: string,
  override: SignupOverride | null,
  nextRunTime: Date | null,
  weeklySchedule?: WeeklySchedule | null,
): Promise<void> => {
  const ref = firestore.collection("settings").doc(docId);

  const payload: Record<string, unknown> = {
    override,
    nextRunTime: nextRunTime ? Timestamp.fromDate(nextRunTime) : null,
    updatedAt: Timestamp.now(),
  };

  if (weeklySchedule !== undefined) {
    payload.weeklySchedule = weeklySchedule;
  }

  await ref.set(payload, { merge: true });
};
