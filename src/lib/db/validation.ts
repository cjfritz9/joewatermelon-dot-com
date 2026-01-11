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
  ];

  return requiredFields.every((field) => field in body);
};
