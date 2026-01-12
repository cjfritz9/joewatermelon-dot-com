/* eslint-disable  @typescript-eslint/no-explicit-any */
export const MAX_NOTES_LENGTH = 200;

export const getToaQueueEntryIsValid = (body: any) => {
  if (typeof body !== "object" || !body) {
    return false;
  }

  const requiredFields = [
    "twitchUsername",
    "rsn",
    "expertKC",
    "ready",
    "redKeris",
    "bgs",
    "zcb",
    "eye",
    "notes",
    "notificationsEnabled",
  ];

  if (!requiredFields.every((field) => field in body)) {
    return false;
  }

  if (typeof body.notes === "string" && body.notes.length > MAX_NOTES_LENGTH) {
    return false;
  }

  return true;
};

export const getTobQueueEntryIsValid = (body: any) => {
  if (typeof body !== "object" || !body) {
    return false;
  }

  const requiredFields = [
    "twitchUsername",
    "rsn",
    "kc",
    "ready",
    "scythe",
    "needs4Man",
    "needs5Man",
    "notes",
    "notificationsEnabled",
  ];

  if (!requiredFields.every((field) => field in body)) {
    return false;
  }

  if (typeof body.notes === "string" && body.notes.length > MAX_NOTES_LENGTH) {
    return false;
  }

  return true;
};
