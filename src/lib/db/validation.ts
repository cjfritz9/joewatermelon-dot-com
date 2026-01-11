/* eslint-disable  @typescript-eslint/no-explicit-any */
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

  return requiredFields.every((field) => field in body);
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

  return requiredFields.every((field) => field in body);
};
