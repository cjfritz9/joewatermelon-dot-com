import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const EVENT_TIMEZONE = "America/Chicago";

export const RUN_WINDOW_MS = 12 * 60 * 60 * 1000;
export const SIGNUP_LEAD_MS = 2 * 60 * 60 * 1000;

export interface WeeklySchedule {
  dayOfWeek: number;
  hour: number;
  minute: number;
}

export const isWeeklySchedule = (value: unknown): value is WeeklySchedule => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.dayOfWeek === "number" &&
    v.dayOfWeek >= 0 &&
    v.dayOfWeek <= 6 &&
    typeof v.hour === "number" &&
    v.hour >= 0 &&
    v.hour <= 23 &&
    typeof v.minute === "number" &&
    v.minute >= 0 &&
    v.minute <= 59
  );
};

export const scheduleFromDate = (date: Date): WeeklySchedule => {
  const d = dayjs(date).tz(EVENT_TIMEZONE);
  return { dayOfWeek: d.day(), hour: d.hour(), minute: d.minute() };
};

export const nextOccurrenceAfter = (
  schedule: WeeklySchedule,
  after: Date,
): Date => {
  const reference = dayjs(after);
  let candidate = reference
    .tz(EVENT_TIMEZONE)
    .hour(schedule.hour)
    .minute(schedule.minute)
    .second(0)
    .millisecond(0);

  const dayDiff = (schedule.dayOfWeek - candidate.day() + 7) % 7;
  candidate = candidate.add(dayDiff, "day");

  if (!candidate.isAfter(reference)) {
    candidate = candidate.add(7, "day");
  }

  return candidate.toDate();
};

export const formatWeeklySchedule = (schedule: WeeklySchedule): string => {
  const sample = dayjs()
    .tz(EVENT_TIMEZONE)
    .day(schedule.dayOfWeek)
    .hour(schedule.hour)
    .minute(schedule.minute)
    .second(0)
    .millisecond(0)
    .toDate();

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: EVENT_TIMEZONE,
  }).format(sample);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: EVENT_TIMEZONE,
  }).format(sample);

  return `${weekday}s at ${time} Central`;
};
